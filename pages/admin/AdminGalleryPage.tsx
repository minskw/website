
import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { GalleryAlbum, GalleryImageItem } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X, ImagePlus } from 'lucide-react';

type AlbumFormData = Omit<GalleryAlbum, 'id' | 'createdAt'>;

const emptyAlbum: AlbumFormData = {
    title: '',
    category: 'Kegiatan',
    images: [{ imageUrl: '', caption: '' }],
};

const AlbumFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (album: AlbumFormData, id?: string) => void;
    album: GalleryAlbum | null;
}> = ({ isOpen, onClose, onSave, album }) => {
    const [formData, setFormData] = useState<AlbumFormData>(emptyAlbum);

    useEffect(() => {
        setFormData(album ? { title: album.title, category: album.category, images: album.images.length > 0 ? album.images : [{ imageUrl: '', caption: '' }] } : emptyAlbum);
    }, [album, isOpen]);

    const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index: number, field: keyof GalleryImageItem, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, { imageUrl: '', caption: '' }] }));
    };

    const removeImageField = (index: number) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            images: formData.images.filter(img => img.imageUrl.trim() !== '')
        };
        if (finalData.images.length === 0) {
            alert("Mohon tambahkan setidaknya satu gambar.");
            return;
        }
        onSave(finalData, album?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{album ? 'Edit Album' : 'Tambah Album Baru'}</h2>
                        <button type="button" onClick={onClose}><X /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <input name="title" value={formData.title} onChange={handleAlbumChange} placeholder="Judul Album" className="w-full p-2 border rounded" required />
                        <select name="category" value={formData.category} onChange={handleAlbumChange} className="w-full p-2 border rounded">
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Fasilitas">Fasilitas</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        
                        <h3 className="text-lg font-semibold border-b pb-2">Gambar</h3>
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-2 items-start border p-3 rounded-md relative">
                                <span className="font-bold text-gray-500">{index + 1}.</span>
                                <div className="flex-grow space-y-2">
                                     <input
                                        type="text"
                                        value={image.imageUrl}
                                        onChange={e => handleImageChange(index, 'imageUrl', e.target.value)}
                                        placeholder="URL Gambar"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={image.caption}
                                        onChange={e => handleImageChange(index, 'caption', e.target.value)}
                                        placeholder="Keterangan (Caption)"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={formData.images.length <= 1}
                                    title="Hapus gambar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                            <ImagePlus size={16} /> Tambah Gambar Lain
                        </button>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Simpan Album</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminGalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const albumsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryAlbum));
            setAlbums(albumsData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching albums in real-time:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: AlbumFormData, id?: string) => {
        try {
            if (id) {
                const albumRef = doc(db, "gallery_albums", id);
                await updateDoc(albumRef, { ...data });
            } else {
                const albumRef = collection(db, "gallery_albums");
                await addDoc(albumRef, { ...data, createdAt: new Date().toISOString() });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving album:", error);
            alert("Gagal menyimpan album.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus album ini beserta semua fotonya?")) {
            try {
                await deleteDoc(doc(db, "gallery_albums", id));
            } catch (error) {
                console.error("Error deleting album:", error);
                alert("Gagal menghapus album.");
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
                <button onClick={() => { setSelectedAlbum(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <PlusCircle size={18} /> Tambah Album
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                         <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Judul Album</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Kategori</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Jumlah Gambar</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {albums.map(album => (
                                <tr key={album.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-800">{album.title}</td>
                                    <td className="py-3 px-4">{album.category}</td>
                                    <td className="py-3 px-4 text-center">{album.images.length}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button onClick={() => { setSelectedAlbum(album); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(album.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <AlbumFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} album={selectedAlbum} />
        </div>
    );
};

export default AdminGalleryPage;
