import React, { useState } from 'react';
import { mockNews } from '../../services/mockApi';
import { NewsArticle } from '../../types';
import { PlusCircle, Edit, Trash2, X } from 'lucide-react';

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>(mockNews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);

    const openModal = (article: NewsArticle | null = null) => {
        setCurrentArticle(article ? { ...article } : {
            id: `news-${Date.now()}`,
            title: '',
            category: 'Kegiatan',
            date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            imageUrl: '',
            excerpt: '',
            content: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };
    
    const handleSave = () => {
        if (!currentArticle) return;

        // Simple validation
        if (!currentArticle.title || !currentArticle.excerpt || !currentArticle.content) {
            alert('Judul, excerpt, dan konten harus diisi.');
            return;
        }

        const isEditing = news.some(n => n.id === currentArticle.id);

        if (isEditing) {
            setNews(news.map(n => n.id === currentArticle.id ? currentArticle : n));
        } else {
            setNews([currentArticle, ...news]);
        }
        closeModal();
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
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

        const isEditing = news.some(n => n.id === currentArticle.id);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
                            <input type="text" name="title" value={currentArticle.title} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                <select name="category" value={currentArticle.category} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md bg-white">
                                    <option>Kegiatan</option>
                                    <option>Pengumuman</option>
                                    <option>Prestasi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input type="text" name="imageUrl" value={currentArticle.imageUrl} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="https://picsum.photos/..."/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Excerpt (Ringkasan)</label>
                            <textarea name="excerpt" value={currentArticle.excerpt} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Konten Lengkap (HTML)</label>
                            <textarea name="content" value={currentArticle.content} onChange={handleChange} rows={8} className="mt-1 w-full px-3 py-2 border rounded-md"></textarea>
                        </div>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">{isEditing ? 'Simpan Perubahan' : 'Publikasikan'}</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
                    <PlusCircle size={18} /> Tambah Berita
                </button>
            </div>
            <div className="overflow-x-auto">
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
                                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{article.title}</td>
                                <td className="px-6 py-4">{article.category}</td>
                                <td className="px-6 py-4">{article.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModal(article)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminNewsPage;
