import React, { useState, useMemo, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { PlusCircle, Edit, Trash2, X, Search } from 'lucide-react';

// Firebase imports
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const AdminGalleryPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const galleryCollectionRef = collection(db, "gallery");
    const imageCategories: GalleryImage['category'][] = ['Kegiatan', 'Prestasi', 'Ekstrakurikuler', 'Akademik'];

    useEffect(() => {
        const getImages = async () => {
            setIsLoading(true);
            const q = query(galleryCollectionRef, orderBy("caption"));
            const data = await getDocs(q);
            const imagesData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryImage));
            setImages(imagesData);
            setIsLoading(false);
        };
        getImages();
    }, []);

    const filteredImages = useMemo(() => {
        return images.filter(image =>
            image.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [images, searchTerm]);

    const openModal = (image: GalleryImage | null = null) => {
        setCurrentImage(image ? { ...image } : {
            id: '', // Handled by Firestore
            imageUrl: '',
            caption: '',
            category: 'Kegiatan',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage(null);
    };

    const handleSave = async () => {
        if (!currentImage) return;
        
        if (!currentImage.imageUrl || !currentImage.caption) {
            alert('URL Gambar dan Keterangan harus diisi.');
            return;
        }

        const { id, ...imageData } = currentImage;

        if (id) { // Editing existing image
            const imageDoc = doc(db, "gallery", id);
            await updateDoc(imageDoc, imageData);
            setImages(images.map(img => img.id === id ? currentImage : img));
        } else { // Adding new image
            const docRef = await addDoc(galleryCollectionRef, imageData);
            setImages([...images, { ...currentImage, id: docRef.id }]);
        }
        closeModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            const imageDoc = doc(db, "gallery", id);
            await deleteDoc(imageDoc);
            setImages(images.filter(img => img.id !== id));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!currentImage) return;
        const { name, value } = e.target;
        setCurrentImage({ ...currentImage, [name]: value });
    };
    
    const renderModal = () => {
        if (!isModalOpen || !currentImage) return null;
        
        const isEditing = !!currentImage.id;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Gambar Galeri' : 'Tambah Gambar Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium">URL Gambar</label>
                            <input type="url" name="imageUrl" value={currentImage.imageUrl} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="https://..."/>
                            <p className="text-xs text-gray-500 mt-1">Tempelkan link gambar yang dapat diakses publik (misal: dari Google Drive, Imgur).</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Keterangan (Caption)</label>
                            <input type="text" name="caption" value={currentImage.caption} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kategori</label>
                            <select name="category" value={currentImage.category} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md bg-white">
                                {imageCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold w-full sm:w-auto justify-center">
                    <PlusCircle size={18} /> Tambah Gambar
                </button>
            </div>
            
             <div className="mb-4">
                 <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan keterangan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="overflow-x-auto">
                 {isLoading ? (
                    <p className="text-center py-8">Memuat data galeri...</p>
                ) : (
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Gambar</th>
                            <th className="px-6 py-3">Keterangan</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImages.map(image => (
                             <tr key={image.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img src={image.imageUrl} alt={image.caption} className="w-24 h-16 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{image.caption}</td>
                                <td className="px-6 py-4">{image.category}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModal(image)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(image.id)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredImages.length === 0 && (
                             <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    Tidak ada gambar yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                 )}
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminGalleryPage;