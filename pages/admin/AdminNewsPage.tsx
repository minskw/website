import React, { useState, useMemo } from 'react';
import { mockNews } from '../../services/mockApi';
import { NewsArticle } from '../../types';
import { PlusCircle, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>(mockNews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
    const [filterCategory, setFilterCategory] = useState('Semua Kategori');

    // AI State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<{ seoTitle?: string; metaDescription?: string; keywords?: string[] } | null>(null);


    const categories = ['Semua Kategori', 'Kegiatan', 'Pengumuman', 'Prestasi'];

    const filteredNews = useMemo(() => {
        if (filterCategory === 'Semua Kategori') {
            return news;
        }
        return news.filter(article => article.category === filterCategory);
    }, [news, filterCategory]);

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
        setAiPrompt('');
        setAiSuggestions(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentArticle(null);
    };
    
    const handleSave = () => {
        if (!currentArticle) return;

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

    const handleGenerateContent = async () => {
        if (!aiPrompt.trim()) {
            alert('Silakan masukkan topik berita.');
            return;
        }
        setIsGenerating(true);
        setAiSuggestions(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'Judul berita yang menarik dan SEO-friendly, maksimal 70 karakter.' },
                    content: { type: Type.STRING, description: 'Isi konten berita lengkap dalam format HTML paragraf (<p>). Minimal 3 paragraf.' },
                    seoTitle: { type: Type.STRING, description: 'Judul alternatif untuk SEO, sedikit berbeda dari judul utama.' },
                    metaDescription: { type: Type.STRING, description: 'Meta deskripsi singkat dan menarik untuk SEO, maksimal 160 karakter.' },
                    keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: '5-7 kata kunci relevan.'
                    }
                },
                required: ['title', 'content', 'seoTitle', 'metaDescription', 'keywords']
            };

            const fullPrompt = `Buatkan draf artikel berita untuk website sekolah MIN Singkawang berdasarkan topik berikut: "${aiPrompt}". Artikel harus informatif, positif, dan cocok untuk audiens orang tua dan siswa. Sertakan juga elemen SEO.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });

            const result = JSON.parse(response.text.trim());
            
            if (currentArticle) {
                setCurrentArticle({
                    ...currentArticle,
                    title: result.title,
                    content: result.content,
                    excerpt: result.metaDescription, // Use meta description for excerpt
                });
            }

            setAiSuggestions({
                seoTitle: result.seoTitle,
                metaDescription: result.metaDescription,
                keywords: result.keywords,
            });

        } catch (error) {
            console.error("Error generating content with AI:", error);
            alert('Gagal membuat konten dengan AI. Silakan coba lagi.');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderModal = () => {
        if (!isModalOpen || !currentArticle) return null;

        const isEditing = news.some(n => n.id === currentArticle.id);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold font-poppins text-gray-800">{isEditing ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-800"><X size={24}/></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* AI Assistant Section */}
                        <div className="p-4 border-2 border-dashed border-green-200 rounded-lg bg-green-50 space-y-3">
                            <h4 className="font-bold text-gray-700 flex items-center gap-2"><Sparkles className="text-yellow-500"/> Asisten Konten & SEO AI</h4>
                            <p className="text-sm text-gray-600">Masukkan topik atau ide berita, dan biarkan AI membantu Anda membuat draf awal beserta optimasi SEO.</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Contoh: Lomba 17 Agustus di sekolah"
                                    className="flex-grow px-3 py-2 border rounded-md bg-white"
                                    disabled={isGenerating}
                                />
                                <button
                                    onClick={handleGenerateContent}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-secondary text-primary font-semibold rounded-lg hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-wait flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? 'Membuat...' : 'Generate'}
                                </button>
                            </div>
                            {aiSuggestions && (
                                <div className="mt-4 p-3 bg-white border rounded-md text-sm space-y-2 animate-fade-in-up">
                                    <h5 className="font-semibold text-primary">Saran SEO dari AI:</h5>
                                    <p><strong>Judul SEO:</strong> {aiSuggestions.seoTitle}</p>
                                    <p><strong>Meta Deskripsi:</strong> {aiSuggestions.metaDescription}</p>
                                    <p><strong>Kata Kunci:</strong> {aiSuggestions.keywords?.join(', ')}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Form Fields */}
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
                            <label className="block text-sm font-medium text-gray-700">Excerpt (Ringkasan/Meta Deskripsi)</label>
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
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold w-full sm:w-auto justify-center">
                    <PlusCircle size={18} /> Tambah Berita
                </button>
            </div>
             <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mr-2">Filter Kategori:</label>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 border rounded-md bg-white text-sm"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
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
                        {filteredNews.map(article => (
                             <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{article.title}</td>
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
                    </tbody>
                </table>
                 {filteredNews.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Tidak ada berita yang cocok dengan filter.</p>
                )}
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminNewsPage;