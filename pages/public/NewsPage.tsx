import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { NewsArticle } from '../../types';
import { LoaderCircle, Calendar, ArrowLeft } from 'lucide-react';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const date = new Date(article.date + 'T00:00:00');
    const day = date.toLocaleDateString('id-ID', { day: '2-digit' });
    const month = date.toLocaleDateString('id-ID', { month: 'short' });
    const year = date.toLocaleDateString('id-ID', { year: 'numeric' });

    return (
        <article className="mediapost flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
             <div className="scinfo w-full md:w-[15%] flex-shrink-0 flex md:flex-col items-stretch">
                <div className="scdate w-full bg-[--sch-body-color-yellow] p-2.5 flex flex-wrap justify-center items-center text-center leading-tight font-archivo">
                    <span className="day text-3xl font-extrabold leading-none">{day}</span>
                    <span className="month text-base font-medium mx-1.5">{month}</span>
                    <span className="year text-sm">{year}</span>
                </div>
                <div className="jumlah-comments w-[30%] md:w-full bg-[--sch-main-color] text-white flex justify-center items-center p-2.5 text-xs">
                    {article.category}
                </div>
            </div>
            <div className="boxinfo w-full md:w-[85%] p-4 md:pl-5 flex flex-col justify-center">
                 <h2 className='text-lg font-bold mb-2 leading-tight text-dark hover:text-primary transition-colors'>
                    <Link to={`/berita/${article.id}`}>{article.title}</Link>
                 </h2>
                 <p className="post-snippet text-sm text-gray-600 mb-3">{article.excerpt}</p>
                 <Link to={`/berita/${article.id}`} className="font-semibold text-primary text-sm hover:underline self-start">
                    Baca Selengkapnya
                </Link>
            </div>
        </article>
    );
};


const NewsContent: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            {content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
};

const NewsDetailPage: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[500px] object-cover" />
        <div className="p-6 md:p-10">
            <Link to="/berita" className="inline-flex items-center gap-2 text-primary font-semibold mb-4 hover:underline">
                <ArrowLeft size={18} /> Kembali ke Semua Berita
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-800 mb-3">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b pb-4">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(article.date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-200">{article.category}</span>
            </div>
            <NewsContent content={article.content} />
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
        <div className="bg-light py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                        <h1 className="text-4xl font-bold font-sans text-center text-primary mb-10">Arsip Berita</h1>
                        {articles.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
