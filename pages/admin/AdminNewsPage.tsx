
import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../../services/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { NewsArticle } from '../../types';
import { PlusCircle, Edit, Trash2, LoaderCircle, X } from 'lucide-react';

type NewsFormData = Omit<NewsArticle, 'id' | 'date'>;

const emptyNews: NewsFormData = {
    title: '',
    category: 'Kegiatan',
    imageUrl: '',
    excerpt: '',
    content: ''
};

const NewsFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (article: NewsFormData, id?: string) => void;
    article: NewsArticle | null;
}> = ({ isOpen, onClose, onSave, article }) => {
    const [formData, setFormData] = useState<NewsFormData>(emptyNews);

    useEffect(() => {
        setFormData(article ? { title: article.title, category: article.category, imageUrl: article.imageUrl, excerpt: article.excerpt, content: article.content } : emptyNews);
    }, [article, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData, article?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{article ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
                        <button type="button" onClick={onClose}><X /></button>
                    </div>
                    <div className="space-y-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Judul Berita" className="w-full p-2 border rounded" required />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Pengumuman">Pengumuman</option>
                        </select>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Gambar Utama" className="w-full p-2 border rounded" required />
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Kutipan Singkat (Excerpt)" className="w-full p-2 border rounded h-24" required />
                        <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Konten Lengkap (mendukung HTML)" className="w-full p-2 border rounded h-48" required />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Simpan Berita</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminNewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "news"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const articlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
            setArticles(articlesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching news in real-time:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (data: NewsFormData, id?: string) => {
        try {
            if (id) {
                await updateDoc(doc(db, "news", id), data);
            } else {
                await addDoc(collection(db, "news"), { ...data, date: new Date().toISOString() });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving news article:", error);
            alert("Gagal menyimpan berita.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
            try {
                await deleteDoc(doc(db, "news", id));
            } catch (error) {
                console.error("Error deleting news article:", error);
                alert("Gagal menghapus berita.");
            }
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => { setSelectedArticle(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <PlusCircle size={18} /> Tambah Berita
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                         <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Judul</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Kategori</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tanggal Publikasi</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(article => (
                                <tr key={article.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-800">{article.title}</td>
                                    <td className="py-3 px-4"><span className="px-2 py-1 text-xs rounded-full bg-gray-200">{article.category}</span></td>
                                    <td className="py-3 px-4">{new Date(article.date).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button onClick={() => { setSelectedArticle(article); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <NewsFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} article={selectedArticle} />
        </div>
    );
};

export default AdminNewsPage;
