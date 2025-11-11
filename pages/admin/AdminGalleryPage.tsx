import React, { useState, useEffect, FormEvent } from 'react';
import { db, storage } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GalleryAlbum, GalleryImageItem } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X, ImagePlus, MinusCircle } from 'lucide-react';

// Types for the form state, which can include local File objects for new uploads
type FormImageItem = GalleryImageItem & { file?: File };
type AlbumFormState = Omit<GalleryAlbum, 'id' | 'createdAt' | 'images'> & {
    images: FormImageItem[];
};

const emptyAlbum: AlbumFormState = {
    title: '',
    category: 'Kegiatan',
    images: [{ imageUrl: '', caption: '', file: undefined }],
};

interface AlbumFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (album: AlbumFormState, id?: string) => void;
    album: GalleryAlbum | null;
    isSaving: boolean;
}

const AlbumFormModal: React.FC<AlbumFormModalProps> = ({ isOpen, onClose, onSave, album, isSaving }) => {
    const [formData, setFormData] = useState<AlbumFormState>(emptyAlbum);

    useEffect(() => {
        if (album) {
            // When editing, images from DB don't have a `file` property initially.
            const imagesWithFileProp = album.images.map(img => ({ ...img, file: undefined }));
            setFormData({ ...album, images: imagesWithFileProp });
        } else {
            setFormData(emptyAlbum);
        }
    }, [album, isOpen]);
    
    // Effect to clean up blob URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            formData.images.forEach(image => {
                if (image.imageUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(image.imageUrl);
                }
            });
        };
    }, [formData.images]);


    const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFile = e.target.files[0];
            const newImages = [...formData.images];
            // If there's an old blob URL, revoke it
            if (newImages[index].imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(newImages[index].imageUrl);
            }
            newImages[index] = { ...newImages[index], file: newFile, imageUrl: URL.createObjectURL(newFile) };
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleImageCaptionChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index].caption = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, { imageUrl: '', caption: '', file: undefined }] }));
    };

    const removeImageField = (index: number) => {
        if (formData.images.length <= 1) return; // Must have at least one image
        const imageToRemove = formData.images[index];
        if (imageToRemove.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.imageUrl);
        }
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData, album?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{album ? 'Edit Album' : 'Tambah Album Baru'}</h2>
                        <button type="button" onClick={onClose}><X /></button>
                    </div>
                    <div className="space-y-4">
                        <input name="title" value={formData.title} onChange={handleAlbumChange} placeholder="Judul Album" className="w-full p-2 border rounded" required />
                        <input name="category" value={formData.category} onChange={handleAlbumChange} placeholder="Kategori Album" className="w-full p-2 border rounded" required />
                        
                        <h3 className="font-semibold pt-2 border-t">Gambar</h3>
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-2 items-start p-3 border rounded-md bg-gray-50">
                                <span className="pt-2 font-bold text-gray-500">{index + 1}.</span>
                                <div className="flex-grow space-y-2">
                                     {image.imageUrl && (
                                        <img src={image.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md border"/>
                                     )}
                                     <input type="file" accept="image/*" onChange={e => handleImageFileChange(index, e)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-dark/10 file:text-primary-dark hover:file:bg-primary-dark/20" />
                                     <input value={image.caption} onChange={e => handleImageCaptionChange(index, e.target.value)} placeholder="Keterangan (Caption)" className="w-full p-2 border rounded" />
                                </div>
                                <button type="button" onClick={() => removeImageField(index)} className="p-2 text-red-500 hover:text-red-700" title="Hapus Gambar">
                                    <MinusCircle size={20} />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addImageField} className="flex items-center gap-2 text-sm text-primary font-semibold py-2 px-3 border-2 border-dashed rounded-md hover:bg-green-50">
                            <ImagePlus size={16} /> Tambah Gambar
                        </button>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400 flex items-center gap-2">
                            {isSaving && <LoaderCircle className="animate-spin" size={18} />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Album'}
                        </button>
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
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const albumData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryAlbum));
            setAlbums(albumData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: AlbumFormState, id?: string) => {
        setIsSaving(true);
        try {
            // 1. Upload new image files and get their URLs
            const uploadedImages = await Promise.all(
                data.images.map(async (image) => {
                    if (image.file) { // If there's a new file, upload it
                        const storageRef = ref(storage, `gallery_images/${Date.now()}-${image.file.name}`);
                        const snapshot = await uploadBytes(storageRef, image.file);
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        return { imageUrl: downloadURL, caption: image.caption };
                    }
                    // If no file, it's an existing image. Keep its data.
                    return { imageUrl: image.imageUrl, caption: image.caption };
                })
            );

            // 2. Filter out any empty image fields
            const finalImages = uploadedImages.filter(img => img.imageUrl);

            // 3. Prepare the final data object for Firestore
            const finalAlbumData = {
                title: data.title,
                category: data.category,
                images: finalImages,
            };

            // 4. Save to Firestore
            if (id) {
                await updateDoc(doc(db, "gallery_albums", id), finalAlbumData);
            } else {
                await addDoc(collection(db, "gallery_albums"), { ...finalAlbumData, createdAt: new Date().toISOString() });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving album:", error);
            alert("Gagal menyimpan album.");
        } finally {
            setIsSaving(false);
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
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri Album</h1>
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
            <AlbumFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                album={selectedAlbum}
                isSaving={isSaving}
            />
        </div>
    );
};

export default AdminGalleryPage;
