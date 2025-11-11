import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { GalleryAlbum, GalleryImageItem } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X } from 'lucide-react';

type AlbumFormData = Omit<GalleryAlbum, 'id' | 'createdAt'>;

const emptyAlbum: AlbumFormData = {
    title: '',
    category: 'Kegiatan',
    images: []
};

// Helper to convert images array to string for textarea
const imagesToString = (images: GalleryImageItem[]): string => {
    return images.map(img => `${img.imageUrl.trim()}|${img.caption.trim()}`).join('\n');
};

// Helper to convert string from textarea back to images array
const stringToImages = (str: string): GalleryImageItem[] => {
    if (!str.trim()) return [];
    return str.split('\n').map(line => {
        const parts = line.split('|');
        return {
            imageUrl: parts[0]?.trim() || '',
            caption: parts[1]?.trim() || ''
        };
    }).filter(img => img.imageUrl); // Only include items with an image URL
};

const AlbumFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (album: Omit<GalleryAlbum, 'id'>, id?: string) => void;
    album: GalleryAlbum | null;
}> = ({ isOpen, onClose, onSave, album }) => {
    const [formData, setFormData] = useState<AlbumFormData>(emptyAlbum);
    const [imagesText, setImagesText] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (album) {
                const { id, createdAt, ...dataToEdit } = album;
                setFormData(dataToEdit);
                setImagesText(imagesToString(album.images));
            } else {
                setFormData(emptyAlbum);
                setImagesText('');
            }
        }
    }, [album, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setImagesText(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const finalImages = stringToImages(imagesText);
        if (finalImages.length === 0) {
            alert("Album harus memiliki setidaknya satu gambar.");
            return;
        }
        
        const dataToSave = {
            ...formData,
            images: finalImages,
            createdAt: album?.createdAt || new Date().toISOString()
        };
        onSave(dataToSave, album?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{album ? 'Edit Album Galeri' : 'Tambah Album Baru'}</h2>
                        <button type="button" onClick={onClose}><X /></button>
                    </div>
                    <div className="space-y-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Judul Album" className="w-full p-2 border rounded" required />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Fasilitas">Fasilitas</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <textarea
                            value={imagesText}
                            onChange={handleImagesChange}
                            placeholder="Daftar gambar. Format per baris: URL_GAMBAR|Keterangan Gambar"
                            className="w-full p-2 border rounded h-48 font-mono text-sm"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Masukkan satu gambar per baris. Pisahkan URL gambar dan keterangan dengan tanda pipa (|). <br/>
                            Contoh: https://example.com/foto.jpg|Upacara bendera 17 Agustus
                        </p>
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
            console.error("Error fetching gallery albums:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: Omit<GalleryAlbum, 'id'>, id?: string) => {
        try {
            if (id) {
                await updateDoc(doc(db, "gallery_albums", id), data);
            } else {
                await addDoc(collection(db, "gallery_albums"), data);
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
                                    <td className="py-3 px-4"><span className="px-2 py-1 text-xs rounded-full bg-gray-200">{album.category}</span></td>
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
