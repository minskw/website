import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, LoaderCircle } from 'lucide-react';

type ModalMode = 'add' | 'edit' | 'delete' | null;

const AdminGalleryPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | Partial<GalleryImage> | null>(null);

    const galleryCollectionRef = collection(db, "gallery");

    const fetchImages = async () => {
        setIsLoading(true);
        const q = query(galleryCollectionRef, orderBy("caption", "asc"));
        const data = await getDocs(q);
        setImages(data.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryImage)));
        setIsLoading(false);
    };

    useEffect(() => { fetchImages(); }, []);

    const openModal = (mode: ModalMode, image?: GalleryImage) => {
        setModalMode(mode);
        setSelectedImage(mode === 'add' ? { caption: '', imageUrl: '', category: 'Kegiatan' } : image || null);
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedImage(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!selectedImage) return;
        setSelectedImage({ ...selectedImage, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;
        if (modalMode === 'add') {
            await addDoc(galleryCollectionRef, selectedImage);
        } else if (modalMode === 'edit' && selectedImage.id) {
            const imageDoc = doc(db, "gallery", selectedImage.id);
            const { id, ...data } = selectedImage;
            await updateDoc(imageDoc, data);
        }
        fetchImages();
        closeModal();
    };

    const handleDelete = async () => {
        if (modalMode === 'delete' && selectedImage?.id) {
            await deleteDoc(doc(db, "gallery", selectedImage.id));
            fetchImages();
            closeModal();
        }
    };

    const renderModal = () => {
        if (!modalMode || !selectedImage) return null;

        if (modalMode === 'delete') {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Hapus Gambar?</h3>
                        <p>Anda yakin ingin menghapus gambar "<strong>{selectedImage.caption}</strong>"?</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Hapus</button>
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                    <div className="p-6 border-b flex justify-between items-center">
                         <h3 className="text-xl font-bold font-poppins">{modalMode === 'add' ? 'Tambah Gambar Baru' : 'Edit Gambar'}</h3>
                         <button onClick={closeModal}><X/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div><label>URL Gambar</label><input type="text" name="imageUrl" value={selectedImage.imageUrl} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Keterangan (Caption)</label><input type="text" name="caption" value={selectedImage.caption} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Kategori</label>
                            <select name="category" value={selectedImage.category} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded bg-white">
                                <option>Kegiatan</option><option>Prestasi</option><option>Ekstrakurikuler</option><option>Akademik</option>
                            </select>
                        </div>
                        {selectedImage.imageUrl && <img src={selectedImage.imageUrl} alt="Preview" className="mt-2 rounded max-h-40" />}
                    </div>
                    <div className="p-6 bg-gray-50 text-right">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
                <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <Plus size={18} /> Tambah Gambar
                </button>
            </div>
             {isLoading ? <div className="flex justify-center py-10"><LoaderCircle className="animate-spin text-primary" size={32}/></div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(image => (
                        <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                            <img src={image.imageUrl} alt={image.caption} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs font-semibold truncate">{image.caption}</p>
                                <div className="flex justify-end gap-2 mt-1">
                                    <button onClick={() => openModal('edit', image)} className="bg-white text-blue-600 p-1 rounded-full"><Edit size={14} /></button>
                                    <button onClick={() => openModal('delete', image)} className="bg-white text-red-600 p-1 rounded-full"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             )}
             {renderModal()}
        </div>
    );
};

export default AdminGalleryPage;
