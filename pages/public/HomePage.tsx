import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { HomepageContent, NewsArticle } from '../../types';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

const HomePage: React.FC = () => {
    const [content, setContent] = useState<HomepageContent | null>(null);
    const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomepageData = async () => {
            setIsLoading(true);
            try {
                // Fetch homepage content
                const contentDocRef = doc(db, 'settings', 'homepageContent');
                const contentDocSnap = await getDoc(contentDocRef);
                if (contentDocSnap.exists()) {
                    setContent(contentDocSnap.data() as HomepageContent);
                }

                // Fetch latest news
                const newsQuery = query(collection(db, "news"), orderBy("date", "desc"), limit(3));
                const newsSnapshot = await getDocs(newsQuery);
                const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle));
                setLatestNews(newsData);
            } catch (error) => {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomepageData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    return (
        <div className="bg-light">
            {/* Hero Section */}
            {content?.heroImageUrl && (
                <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${content.heroImageUrl})` }}>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <h1 className="text-4xl md:text-5xl font-bold font-poppins">{content.welcomeTitle}</h1>
                            <p className="mt-4 text-lg max-w-2xl">{content.welcomeText.substring(0, 100)}...</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                {content && (
                    <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold font-poppins text-primary mb-4">{content.welcomeTitle}</h2>
                            <p className="text-gray-600 leading-relaxed">{content.welcomeText}</p>
                        </div>
                        <div className="md:w-1/2">
                            <img src={content.welcomeImageUrl} alt="Welcome" className="rounded-lg shadow-lg w-full h-auto" />
                        </div>
                    </section>
                )}

                {/* Latest News */}
                <section>
                    <h2 className="text-3xl font-bold font-poppins text-primary text-center mb-8">Berita Terbaru</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {latestNews.map(article => (
                            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold font-poppins text-gray-800 h-16 overflow-hidden">{article.title}</h3>
                                    <p className="mt-2 text-gray-600 text-sm h-20 overflow-hidden">{article.excerpt}</p>
                                    <Link to={`/berita/${article.id}`} className="mt-4 inline-block font-semibold text-primary hover:text-primary-dark">
                                        Baca Selengkapnya &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/berita" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mx-auto w-fit">
                            Lihat Semua Berita <ArrowRight size={20} />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
