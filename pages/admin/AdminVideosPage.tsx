import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { VideoItem } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X, Tv, Youtube } from 'lucide-react';

type VideoFormData = Omit<VideoItem, 'id' | 'createdAt'>;

const emptyVideo: VideoFormData = {
    title: '',
    type: 'youtube',
    url: '',
    thumbnailUrl: '',
};

const getYoutubeThumbnail = (url: string): string => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` : '';
};

const VideoFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (video: VideoFormData, id?: string) => void;
    video: VideoItem | null;
}> = ({ isOpen, onClose, onSave, video }) => {
    const [formData, setFormData] = useState<VideoFormData>(emptyVideo);

    useEffect(() => {
        setFormData(video ? { ...video } : emptyVideo);
    }, [video, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const url = e.target.value;
        if (formData.type === 'youtube' && url) {
            const thumb = getYoutubeThumbnail(url);
            if (thumb) {
                setFormData(prev => ({ ...prev, thumbnailUrl: thumb }));
            }
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData, video?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{video ? 'Edit Video' : 'Tambah Video Baru'}</h2>
                        <button type="button" onClick={onClose}><X /></button>
                    </div>
                    <div className="space-y-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Judul Video" className="w-full p-2 border rounded" required />
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="youtube">YouTube</option>
                            <option value="google-drive">Google Drive</option>
                        </select>
                        <input name="url" value={formData.url} onChange={handleChange} onBlur={handleUrlBlur} placeholder="URL Video (YouTube atau Google Drive)" className="w-full p-2 border rounded" required />
                        <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="URL Thumbnail (otomatis untuk YouTube)" className="w-full p-2 border rounded" />
                        {formData.thumbnailUrl && <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-32 h-auto rounded border" />}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Simpan Video</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminVideosPage: React.FC = () => {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
            setVideos(videosData);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: VideoFormData, id?: string) => {
        try {
            if (id) {
                await updateDoc(doc(db, "videos", id), data);
            } else {
                await addDoc(collection(db, "videos"), { ...data, createdAt: new Date().toISOString() });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving video:", error);
            alert("Gagal menyimpan video.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus video ini?")) {
            try {
                await deleteDoc(doc(db, "videos", id));
            } catch (error) {
                console.error("Error deleting video:", error);
                alert("Gagal menghapus video.");
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Video</h1>
                <button onClick={() => { setSelectedVideo(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <PlusCircle size={18} /> Tambah Video
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Thumbnail</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Judul</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tipe</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map(video => (
                                <tr key={video.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-16 object-cover rounded" />
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{video.title}</td>
                                    <td className="py-3 px-4">
                                        <span className="flex items-center gap-1.5">
                                            {video.type === 'youtube' ? <Youtube size={16} className="text-red-600"/> : <Tv size={16} className="text-blue-600"/>}
                                            {video.type === 'youtube' ? 'YouTube' : 'Google Drive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 flex items-center gap-2">
                                        <button onClick={() => { setSelectedVideo(video); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(video.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <VideoFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} video={selectedVideo} />
        </div>
    );
};

export default AdminVideosPage;