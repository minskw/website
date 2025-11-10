import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, LoaderCircle, AlertTriangle } from 'lucide-react';

type ModalMode = 'add' | 'edit' | 'delete' | null;

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | Partial<NewsArticle> | null>(null);

    const newsCollectionRef = collection(db, "news");

    const fetchNews = async () => {
        setIsLoading(true);
        const q = query(newsCollectionRef, orderBy("date", "desc"));
        const data = await getDocs(q);
        const newsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as NewsArticle));
        setNews(newsData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const openModal = (mode: ModalMode, article?: NewsArticle) => {
        setModalMode(mode);
        if (mode === 'add') {
            setSelectedArticle({ title: '', category: 'Kegiatan', date: new Date().toISOString().split('T')[0], imageUrl: '', excerpt: '', content: '' });
        } else {
            setSelectedArticle(article || null);
        }
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedArticle(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!selectedArticle) return;
        setSelectedArticle({ ...selectedArticle, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!selectedArticle) return;
        
        if (modalMode === 'add') {
            await addDoc(newsCollectionRef, selectedArticle);
        } else if (modalMode === 'edit' && selectedArticle.id) {
            const articleDoc = doc(db, "news", selectedArticle.id);
            const { id, ...data } = selectedArticle;
            await updateDoc(articleDoc, data);
        }
        
        fetchNews();
        closeModal();
    };
    
    const handleDelete = async () => {
        if (modalMode === 'delete' && selectedArticle?.id) {
            const articleDoc = doc(db, "news", selectedArticle.id);
            await deleteDoc(articleDoc);
            fetchNews();
            closeModal();
        }
    };
    
    const renderModal = () => {
        if (!modalMode || !selectedArticle) return null;

        if (modalMode === 'delete') {
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Hapus Berita?</h3>
                        <p>Anda yakin ingin menghapus berita berjudul "<strong>{selectedArticle.title}</strong>"? Aksi ini tidak dapat dibatalkan.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Hapus</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh]">
                    <div className="p-6 border-b flex justify-between items-center">
                         <h3 className="text-xl font-bold font-poppins">{modalMode === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'}</h3>
                         <button onClick={closeModal}><X/></button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div><label>Judul</label><input type="text" name="title" value={selectedArticle.title} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Kategori</label>
                            <select name="category" value={selectedArticle.category} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded bg-white">
                                <option>Kegiatan</option><option>Prestasi</option><option>Pengumuman</option>
                            </select>
                        </div>
                        <div><label>Tanggal</label><input type="date" name="date" value={selectedArticle.date} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>URL Gambar</label><input type="text" name="imageUrl" value={selectedArticle.imageUrl} onChange={handleFormChange} className="w-full mt-1 p-2 border rounded" /></div>
                        <div><label>Kutipan Singkat (Excerpt)</label><textarea name="excerpt" value={selectedArticle.excerpt} onChange={handleFormChange} rows={3} className="w-full mt-1 p-2 border rounded"></textarea></div>
                        <div><label>Isi Konten (HTML)</label><textarea name="content" value={selectedArticle.content} onChange={handleFormChange} rows={8} className="w-full mt-1 p-2 border rounded"></textarea></div>
                    </div>
                    <div className="p-6 bg-gray-50 text-right">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                    <Plus size={18} /> Tambah Berita
                </button>
            </div>
            
            {isLoading ? <div className="flex justify-center py-10"><LoaderCircle className="animate-spin text-primary" size={32}/></div> : (
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
                                <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4">{article.category}</td>
                                <td className="px-6 py-4">{new Date(article.date).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={() => openModal('edit', article)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => openModal('delete', article)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            {renderModal()}
        </div>
    );
};

export default AdminNewsPage;
