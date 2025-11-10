import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { NewsArticle } from '../../types';
import { Calendar, Tag, LoaderCircle, ArrowLeft } from 'lucide-react';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <Link to={`/berita/${article.id}`}>
            <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover" />
            <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(article.date).toLocaleDateString('id-ID')}</span>
                    <span className="mx-2">|</span>
                    <span className="flex items-center gap-1.5"><Tag size={14} /> {article.category}</span>
                </div>
                <h3 className="text-xl font-bold font-poppins text-gray-800 h-20 overflow-hidden">{article.title}</h3>
                <p className="text-gray-600 mt-2 text-sm h-24 overflow-hidden">{article.excerpt}</p>
                <span className="mt-4 inline-block text-primary font-semibold hover:underline">Baca Selengkapnya</span>
            </div>
        </Link>
    </div>
);

const NewsDetailPage: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <Link to="/berita" className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
            <ArrowLeft size={18} /> Kembali ke Daftar Berita
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-6 border-b pb-4">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="mx-3">|</span>
            <span className="flex items-center gap-1.5"><Tag size={14} /> {article.category}</span>
        </div>
        <img src={article.imageUrl} alt={article.title} className="w-full max-h-[500px] object-cover rounded-lg mb-6" />
        <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
);

const NewsPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            if (id) {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setArticle({ ...docSnap.data(), id: docSnap.id } as NewsArticle);
                }
            } else {
                const q = query(collection(db, 'news'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                setArticles(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as NewsArticle)));
            }
            setIsLoading(false);
        };
        fetchNews();
    }, [id]);

    return (
        <div className="bg-light min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20"><LoaderCircle className="animate-spin text-primary" size={40} /></div>
                ) : id ? (
                    article ? <NewsDetailPage article={article} /> : <p className="text-center">Berita tidak ditemukan.</p>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Berita & Pengumuman</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map(art => <NewsCard key={art.id} article={art} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
