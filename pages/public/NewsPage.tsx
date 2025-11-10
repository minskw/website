
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { NewsArticle } from '../../types';
import { LoaderCircle, Calendar, ArrowLeft } from 'lucide-react';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <Link to={`/berita/${article.id}`} className="block">
            <img src={article.imageUrl} alt={article.title} className="w-full h-56 object-cover" />
            <div className="p-6">
                <span className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <h3 className="font-bold text-lg mt-2 mb-3 h-14 overflow-hidden text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">{article.excerpt}</p>
                <span className="font-semibold text-primary hover:underline">Baca Selengkapnya</span>
            </div>
        </Link>
    </div>
);

const NewsDetailPage: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-96 object-cover" />
        <div className="p-6 md:p-10">
            <Link to="/berita" className="inline-flex items-center gap-2 text-primary font-semibold mb-4 hover:underline">
                <ArrowLeft size={18} /> Kembali ke Semua Berita
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800 mb-3">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(article.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-200">{article.category}</span>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
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
            try {
                if (id) {
                    const docRef = doc(db, 'news', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setArticle({ ...docSnap.data(), id: docSnap.id } as NewsArticle);
                    }
                } else {
                    const newsCollectionRef = collection(db, "news");
                    const q = query(newsCollectionRef, orderBy("date", "desc"));
                    const data = await getDocs(q);
                    const newsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as NewsArticle));
                    setArticles(newsData);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, [id]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {id ? (
                    article ? (
                        <NewsDetailPage article={article} />
                    ) : (
                        <div className="text-center py-20">
                            <p>Berita tidak ditemukan.</p>
                            <Link to="/berita" className="mt-4 inline-block text-primary hover:underline">Kembali ke Semua Berita</Link>
                        </div>
                    )
                ) : (
                    <>
                        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Arsip Berita</h1>
                        {articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.map(art => <NewsCard key={art.id} article={art} />)}
                            </div>
                        ) : (
                             <p className="text-center text-gray-500 mt-8">Belum ada berita yang dipublikasikan.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
