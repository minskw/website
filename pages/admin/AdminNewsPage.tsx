
import React, { useState, useMemo, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { PlusCircle, Edit, Trash2, X, Search } from 'lucide-react';

// Firebase imports
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const newsCollectionRef = collection(db, "news");

    useEffect(() => {
        const getNews = async () => {
            setIsLoading(true);
            const data = await getDocs(query(newsCollectionRef));
            const newsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as NewsArticle));
            // Sort client-side as date format in DB might not be reliable for ordering
            setNews(newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setIsLoading(false);
        };
        getNews();
    }, []);

    const filteredNews = useMemo(() => {
        return news.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [news, searchTerm]);

    const openModal = (article: NewsArticle | null = null) => {
        setCurrentArticle(article ? { ...article } : {
            id: '', // Handled by Firestore
            title: '',
            category: 'Kegiatan',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            imageUrl: 'https://picsum.photos/seed/news' + Date.now() + '/800/600',
            excerpt: '',
            content: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };

    const handleSave = async () => {
        if (!currentArticle) return;
        
        if (!currentArticle.title || !currentArticle.excerpt || !currentArticle.content) {
            alert('Judul, Kutipan, dan Konten harus diisi.');
            return;
        }

        const { id, ...articleData } = currentArticle;

        if (id) { // Editing existing article
            const articleDoc = doc(db, "news", id);
            await updateDoc(articleDoc, articleData);
            setNews(news.map(n => n.id === id ? currentArticle : n));
        } else { // Adding new article
            const docRef = await addDoc(newsCollectionRef, articleData);
            setNews([{ ...currentArticle, id: docRef.id }, ...news]);
        }
        closeModal();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            const articleDoc = doc(db, "news", id);
            await deleteDoc(articleDoc);
            setNews(news.filter(n => n.id !== id));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!currentArticle) return;
        const { name, value } = e.target;
        setCurrentArticle({ ...currentArticle, [name]: value });
    };

    const renderModal = () => {
        if (!isModalOpen || !currentArticle) return null;
        
        const isEditing = !!currentArticle.id;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium">Judul Berita</label>
                            <input type="text" name="title" value={currentArticle.title} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Kategori</label>
                                <select name="category" value={currentArticle.category} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md bg-white">
                                    <option value="Kegiatan">Kegiatan</option>
                                    <option value="Pengumuman">Pengumuman</option>
                                    <option value="Prestasi">Prestasi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tanggal Publikasi</label>
                                <input type="text" name="date" value={currentArticle.date} onChange={handleChange} placeholder="e.g. 21 Juli 2024" className="mt-1 w-full px-3 py-2 border rounded-md" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Image URL</label>
                            <input type="text" name="imageUrl" value={currentArticle.imageUrl} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kutipan Singkat (Excerpt)</label>
                            <textarea name="excerpt" value={currentArticle.excerpt} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Konten Lengkap (HTML didukung)</label>
                            <textarea name="content" value={currentArticle.content} onChange={handleChange} rows={10} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea>
                        </div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan Berita</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold w-full sm:w-auto justify-center">
                    <PlusCircle size={18} /> Tambah Berita
                </button>
            </div>
            
            <div className="mb-4">
                 <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari judul berita..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="overflow-x-auto">
                 {isLoading ? (
                    <p className="text-center py-8">Memuat data berita...</p>
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
                        {filteredNews.map(article => (
                             <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4">{article.category}</td>
                                <td className="px-6 py-4">{article.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModal(article)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800" title="Hapus"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredNews.length === 0 && (
                             <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    Tidak ada berita yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                 )}
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminNewsPage;
