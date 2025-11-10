import React, { useState, useEffect, FormEvent } from 'react';
import { NewsArticle } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { PlusCircle, Edit, Trash2, X, LoaderCircle } from 'lucide-react';

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

    const newsCollectionRef = collection(db, "news");

    useEffect(() => {
        const getNews = async () => {
            setIsLoading(true);
            const q = query(newsCollectionRef, orderBy("date", "desc"));
            const data = await getDocs(q);
            const newsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as NewsArticle));
            setNews(newsData);
            setIsLoading(false);
        };
        getNews();
    }, []);

    const openModal = (article: NewsArticle | null = null) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingArticle(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
            const articleDoc = doc(db, "news", id);
            await deleteDoc(articleDoc);
            setNews(news.filter(n => n.id !== id));
        }
    };

    const NewsForm: React.FC<{ article: NewsArticle | null; onSave: () => void; onCancel: () => void; }> = ({ article, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            title: article?.title || '',
            category: article?.category || 'Kegiatan',
            date: article?.date || new Date().toISOString().split('T')[0],
            imageUrl: article?.imageUrl || '',
            excerpt: article?.excerpt || '',
            content: article?.content || '',
        });

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            if (article) {
                // Update
                const articleDoc = doc(db, "news", article.id);
                await updateDoc(articleDoc, formData);
            } else {
                // Create
                await addDoc(newsCollectionRef, formData);
            }
            onSave();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{article ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="text-sm font-medium">Judul</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 p-2 border rounded" required /></div>
                        <div><label className="text-sm font-medium">Kategori</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full mt-1 p-2 border rounded"><option>Kegiatan</option><option>Prestasi</option><option>Pengumuman</option></select></div>
                        <div><label className="text-sm font-medium">Tanggal</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full mt-1 p-2 border rounded" required/></div>
                        <div><label className="text-sm font-medium">URL Gambar</label><input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full mt-1 p-2 border rounded" required/></div>
                        <div><label className="text-sm font-medium">Ringkasan (Excerpt)</label><textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full mt-1 p-2 border rounded" rows={3} required></textarea></div>
                        <div><label className="text-sm font-medium">Konten Lengkap (HTML)</label><textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full mt-1 p-2 border rounded" rows={6} required></textarea></div>
                    
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
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <PlusCircle size={18} /> Tambah Berita
                </button>
            </div>
            
            <div className="overflow-x-auto">
                 {isLoading ? (
                    <div className="flex justify-center py-8"><LoaderCircle className="animate-spin text-primary" size={32}/></div>
                ) : (
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Judul</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map(article => (
                            <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4">{article.category}</td>
                                <td className="px-6 py-4">{article.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => openModal(article)} title="Edit" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(article.id)} title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 )}
            </div>
            {isModalOpen && <NewsForm article={editingArticle} onSave={() => { closeModal(); window.location.reload(); }} onCancel={closeModal} />}
        </div>
    );
};

export default AdminNewsPage;
