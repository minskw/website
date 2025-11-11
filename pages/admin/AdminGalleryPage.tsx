

import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { db, storage } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { GalleryAlbum, GalleryImageItem } from '../../types';
// FIX: Import the 'Image' icon from lucide-react.
import { PlusCircle, Edit, Trash2, LoaderCircle, X, ImagePlus, Video, Image } from 'lucide-react';

type AlbumFormData = Omit<GalleryAlbum, 'id' | 'createdAt'>;
type ImageFile = { file: File | null; preview: string; existingUrl?: string };

const emptyAlbum: AlbumFormData = {
    title: '',
    category: 'Kegiatan',
    images: [{ imageUrl: '', caption: '' }],
};

const AddImageModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    album: GalleryAlbum;
}> = ({ isOpen, onClose, album }) => {
    const [caption, setCaption] = useState('');
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile({ file, preview: URL.createObjectURL(file) });
        }
    };
    
    const handleSaveImage = async () => {
        if (!imageFile || !imageFile.file) {
            alert("Please select an image to upload.");
            return;
        }
        setIsSaving(true);
        try {
            const storageRef = ref(storage, `gallery/${album.id}/${Date.now()}_${imageFile.file.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile.file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const newImage: GalleryImageItem = { imageUrl: downloadURL, caption };
            const updatedImages = [...album.images, newImage];

            const albumRef = doc(db, "gallery_albums", album.id);
            await updateDoc(albumRef, { images: updatedImages });

            onClose();
        } catch (error) {
            console.error("Error adding new image:", error);
            alert("Failed to add image.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Tambah Gambar ke Album</h2>
                        <button onClick={onClose}><X /></button>
                    </div>
                     <div className="space-y-4">
                        {imageFile?.preview && <img src={imageFile.preview} alt="Preview" className="w-full h-48 object-contain rounded border mb-2"/>}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-dark file:text-white hover:file:bg-primary" />
                        <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Keterangan (Caption)" className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button onClick={handleSaveImage} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2 disabled:bg-gray-400">
                             {isSaving && <LoaderCircle className="animate-spin" size={16} />}
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AdminGalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

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

    const handleDelete = async (albumId: string) => {
        const albumToDelete = albums.find(a => a.id === albumId);
        if (!albumToDelete) return;

        if (window.confirm(`Apakah Anda yakin ingin menghapus album "${albumToDelete.title}"?`)) {
            try {
                // Delete all images from storage first
                const imageDeletePromises = albumToDelete.images.map(image => {
                    const imageRef = ref(storage, image.imageUrl);
                    return deleteObject(imageRef);
                });
                await Promise.all(imageDeletePromises);
                
                // Then delete the document from Firestore
                await deleteDoc(doc(db, "gallery_albums", albumId));
            } catch (error) {
                console.error("Error deleting album and its images:", error);
                alert("Gagal menghapus album.");
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri Foto</h1>
                <div className="flex gap-2">
                    <Link to="/admin/video" className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        <Video size={18} /> Manajemen Video
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map(album => (
                        <div key={album.id} className="group relative bg-gray-100 rounded-lg shadow overflow-hidden">
                            {album.images && album.images.length > 0 ? (
                                <img src={album.images[0].imageUrl} alt={album.title} className="w-full h-40 object-cover" />
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                                    <Image size={40} />
                                    <span className="ml-2 text-sm">Album kosong</span>
                                </div>
                            )}
                            <div className="p-3">
                                <h3 className="font-bold truncate">{album.title}</h3>
                                <p className="text-sm text-gray-600">{album.category} - {album.images.length} foto</p>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
                                <button
                                    onClick={() => { setSelectedAlbum(album); setIsAddImageModalOpen(true); }}
                                    className="p-2 bg-white/80 rounded-full text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Tambah Gambar"
                                >
                                    <ImagePlus size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(album.id)}
                                    className="p-2 bg-white/80 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Hapus Album"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isAddImageModalOpen && selectedAlbum && (
                <AddImageModal 
                    isOpen={isAddImageModalOpen}
                    onClose={() => setIsAddImageModalOpen(false)}
                    album={selectedAlbum}
                />
            )}
        </div>
    );
};

export default AdminGalleryPage;