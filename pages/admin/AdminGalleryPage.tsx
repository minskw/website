import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { GalleryImage } from '../../types';
import { PlusCircle, Trash2, LoaderCircle, X } from 'lucide-react';

type ImageFormData = Omit<GalleryImage, 'id' | 'uploadedAt'>;

const emptyImage: ImageFormData = {
    imageUrl: '',
    caption: '',
    category: 'Kegiatan Sekolah',
};

const ImageFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (image: ImageFormData) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<ImageFormData>(emptyImage);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setFormData(emptyImage);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Tambah Foto Baru</h2>
                        <button onClick={onClose}><X /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Gambar" className="w-full p-2 border rounded" required />
                        <input name="caption" value={formData.caption} onChange={handleChange} placeholder="Keterangan Foto" className="w-full p-2 border rounded" required />
                        <input name="category" value={formData.category} onChange={handleChange} placeholder="Kategori (e.g., Kegiatan Sekolah)" className="w-full p-2 border rounded" required />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const AdminGalleryPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const imageData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
            setImages(imageData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching gallery images:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: ImageFormData) => {
        try {
            await addDoc(collection(db, "gallery"), { ...data, uploadedAt: new Date().toISOString() });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving image:", error);
            alert("Gagal menyimpan foto.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
            try {
                await deleteDoc(doc(db, "gallery", id));
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Gagal menghapus foto.");
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <PlusCircle size={18} /> Tambah Foto
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(image => (
                        <div key={image.id} className="relative group">
                            <img src={image.imageUrl} alt={image.caption} className="w-full h-40 object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                                <p className="text-xs">{image.caption}</p>
                                <button onClick={() => handleDelete(image.id)} className="self-end p-1 bg-red-600 rounded-full hover:bg-red-700">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ImageFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};

export default AdminGalleryPage;
