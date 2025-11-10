import React, { useState, useMemo } from 'react';
import { mockNews } from '../../services/mockApi';
import { NewsArticle } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";
import { PlusCircle, Edit, Trash2, Sparkles, LoaderCircle, CheckCircle, Info, Filter } from 'lucide-react';

interface SeoSuggestions {
    titles: string[];
    meta_description: string;
    keywords: string[];
}

const AddNewsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<NewsArticle, 'id' | 'date' | 'imageUrl' | 'excerpt'> & { metaDescription: string }) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'Kegiatan' | 'Pengumuman' | 'Prestasi'>('Kegiatan');
    const [content, setContent] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [seoSuggestions, setSeoSuggestions] = useState<SeoSuggestions | null>(null);

    const handleGenerateWithAI = async () => {
        if (!aiPrompt) {
            alert("Silakan masukkan topik untuk AI.");
            return;
        }
        setIsGenerating(true);
        setSeoSuggestions(null); // Reset previous suggestions
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Anda adalah seorang spesialis SEO dan penulis konten ahli untuk website sekolah MIN Singkawang.
Berdasarkan topik: "${aiPrompt}"

Buat draf konten berita, beberapa alternatif judul, meta deskripsi, dan kata kunci SEO.
- Judul utama: menarik dan SEO-friendly, maksimal 70 karakter.
- Konten: 2-3 paragraf dalam format HTML paragraf (<p>), formal dan informatif.
- Alternatif judul: 3 judul lain, maksimal 70 karakter.
- Meta deskripsi: menarik, maksimal 160 karakter, ajak orang untuk mengklik.
- Kata kunci: 1 kata kunci utama, dan 4 kata kunci sekunder/terkait.
`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Judul utama artikel yang SEO-friendly." },
                    content: { type: Type.STRING, description: "Konten artikel dalam format HTML (<p>)." },
                    seo_titles: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Array berisi 3 alternatif judul."
                    },
                    meta_description: { type: Type.STRING, description: "Deskripsi meta SEO, maksimal 160 karakter." },
                    keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Array berisi kata kunci SEO yang relevan."
                    }
                },
                required: ["title", "content", "seo_titles", "meta_description", "keywords"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });

            const text = response.text;
            const parsedJson = JSON.parse(text);
            
            setTitle(parsedJson.title || '');
            setContent(parsedJson.content || '');
            setMetaDescription(parsedJson.meta_description || '');
            setSeoSuggestions({
                titles: parsedJson.seo_titles || [],
                meta_description: parsedJson.meta_description || '',
                keywords: parsedJson.keywords || []
            });

        } catch (error) {
            console.error("Error generating content with AI:", error);
            alert("Gagal menghasilkan konten dengan AI. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            alert("Judul dan konten tidak boleh kosong.");
            return;
        }
        onSave({ title, category, content, metaDescription });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                     <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tambah Berita Baru</h2>
                     </div>
                    <div className="p-6 pt-0 flex-grow overflow-y-auto">
                        
                        {/* AI Section */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                            <label htmlFor="ai-prompt" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Sparkles className="text-primary"/> Asisten Konten & SEO AI</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    id="ai-prompt"
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="Contoh: Lomba 17 Agustus di sekolah"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={isGenerating}
                                    className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400"
                                >
                                    {isGenerating ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                    <span>{isGenerating ? 'Membuat...' : 'Generate'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Berita</label>
                                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                        <option>Kegiatan</option>
                                        <option>Pengumuman</option>
                                        <option>Prestasi</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Deskripsi (untuk Google)</label>
                                    <textarea id="metaDescription" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"></textarea>
                                </div>
                           </div>
                           {seoSuggestions && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2"><CheckCircle className="text-green-500" /> Saran SEO dari AI</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600">Alternatif Judul:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-500 mt-1">
                                            {seoSuggestions.titles.map((t, i) => <li key={i}><button type="button" onClick={() => setTitle(t)} className="text-blue-600 hover:underline text-left">{t}</button></li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600">Saran Kata Kunci:</h4>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {seoSuggestions.keywords.map((k, i) => <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{k}</span>)}
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-2 text-xs text-gray-500 mt-2 bg-yellow-50 p-2 rounded-md">
                                        <Info size={16} className="flex-shrink-0 mt-0.5"/>
                                        <span>Gunakan kata kunci ini secara alami di dalam konten Anda untuk hasil terbaik.</span>
                                    </div>
                                </div>
                            </div>
                           )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Isi Konten (HTML)</label>
                            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={10} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm"></textarea>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 text-right space-x-3 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Simpan Berita</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminNewsPage: React.FC = () => {
    const [news, setNews] = useState(mockNews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'Kegiatan' | 'Pengumuman' | 'Prestasi'>('all');

    const handleSaveNews = (data: Omit<NewsArticle, 'id' | 'date' | 'imageUrl' | 'excerpt'>) => {
        const newArticle: NewsArticle = {
            id: `news${news.length + 1}-${Date.now()}`,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            imageUrl: `https://picsum.photos/seed/news${news.length + 1}/800/600`,
            excerpt: data.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
            ...data
        };
        setNews([newArticle, ...news]);
        setIsModalOpen(false);
    };

    const filteredNews = useMemo(() => {
        if (categoryFilter === 'all') {
            return news;
        }
        return news.filter(article => article.category === categoryFilter);
    }, [news, categoryFilter]);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="border rounded-lg p-2 bg-white text-gray-900 focus:ring-primary focus:border-primary"
                >
                    <option value="all">Semua Kategori</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Prestasi">Prestasi</option>
                </select>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            >
                <PlusCircle size={18} /> <span className="hidden sm:inline">Tambah Berita</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Judul</th>
                <th scope="col" className="px-6 py-3">Kategori</th>
                <th scope="col" className="px-6 py-3">Tanggal</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map(article => (
                <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                  <td className="px-6 py-4">{article.category}</td>
                  <td className="px-6 py-4">{article.date}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button title="Edit" className="text-yellow-600 hover:text-yellow-800"><Edit size={18} /></button>
                    <button title="Hapus" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredNews.length === 0 && <p className="text-center text-gray-500 mt-6">Tidak ada berita yang cocok dengan filter yang dipilih.</p>}
        </div>
      </div>
      <AddNewsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNews}
      />
    </>
  );
};

export default AdminNewsPage;