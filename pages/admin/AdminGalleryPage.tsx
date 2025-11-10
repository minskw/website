import React, { useState, useEffect, FormEvent } from 'react';
import { GalleryImage } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { PlusCircle, Trash2, X, LoaderCircle } from 'lucide-react';

const AdminGalleryPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const galleryCollectionRef = collection(db, "gallery");

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

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
            const imageDoc = doc(db, "gallery", id);
            await deleteDoc(imageDoc);
            setImages(images.filter(img => img.id !== id));
        }
    };
    
    const ImageForm: React.FC<{ onSave: () => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            imageUrl: '',
            caption: '',
            category: 'Kegiatan' as GalleryImage['category'],
        });

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            await addDoc(galleryCollectionRef, formData);
            onSave();
        };

        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                     <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">Tambah Foto Baru</h3>
                        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="text-sm font-medium">URL Gambar</label><input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Keterangan (Caption)</label><input type="text" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Kategori</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full mt-1 p-2 border rounded"><option>Kegiatan</option><option>Prestasi</option><option>Ekstrakurikuler</option><option>Akademik</option></select></div>
                        <div className="p-6 bg-gray-50 rounded-b-lg text-right space-x-3 -m-6 mt-4">
                            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
                 <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <PlusCircle size={18} /> Tambah Foto
                </button>
            </div>
            
            {isLoading ? (
                 <div className="flex justify-center py-8"><LoaderCircle className="animate-spin text-primary" size={32}/></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(image => (
                        <div key={image.id} className="group relative border rounded-lg overflow-hidden shadow">
                             <img src={image.imageUrl} alt={image.caption} className="w-full h-40 object-cover" />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-between p-2">
                                <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{image.caption}</p>
                                <button onClick={() => handleDelete(image.id)} className="self-end bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity">
                                    <Trash2 size={16}/>
                                </button>
                             </div>
                        </div>
                    ))}
                </div>
            )}
            
            {isModalOpen && <ImageForm onSave={() => { setIsModalOpen(false); window.location.reload(); }} onCancel={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AdminGalleryPage;
