import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { HomepageContent, NewsArticle } from '../../types';
import { LoaderCircle } from 'lucide-react';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <Link to={`/berita/${article.id}`}>
            <img className="w-full h-48 object-cover" src={article.imageUrl} alt={article.title} />
        </Link>
        <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">{new Date(article.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - <span className="font-semibold text-primary">{article.category}</span></p>
            <h3 className="text-xl font-bold font-sans text-dark mb-2">
                <Link to={`/berita/${article.id}`} className="hover:text-primary transition-colors">{article.title}</Link>
            </h3>
            <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
            <Link to={`/berita/${article.id}`} className="font-semibold text-primary hover:underline">
                Baca Selengkapnya
            </Link>
        </div>
    </div>
);


const HomePage: React.FC = () => {
    const [content, setContent] = useState<HomepageContent | null>(null);
    const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const contentDocRef = doc(db, 'settings', 'homepageContent');
                const contentDoc = await getDoc(contentDocRef);
                if (contentDoc.exists()) setContent(contentDoc.data() as HomepageContent);

                const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
                const newsSnap = await getDocs(newsQuery);
                setLatestNews(newsSnap.docs.map(d => ({ ...d.data(), id: d.id } as NewsArticle)));
            } catch (error) {
                console.error("Failed to fetch homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    const heroImage = content?.heroImageUrl || 'https://images.unsplash.com/photo-1576765682835-a73c552096e2?q=80&w=2070&auto=format&fit=crop';
    
    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-96 text-white flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-sans drop-shadow-md">Selamat Datang di MIN Singkawang</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto drop-shadow-sm">Membentuk Generasi Cerdas, Berakhlak, dan Berprestasi</p>
                    <Link to="/ppdb" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                        Pendaftaran Siswa Baru
                    </Link>
                </div>
            </section>
            
            {/* Latest News */}
            <section className="py-16 bg-light">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-sans text-center text-dark mb-8">Berita Terkini</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestNews.length > 0 ? latestNews.map((news) => (
                            <NewsCard key={news.id} article={news} />
                        )) : <p className="col-span-full text-center text-gray-500">Belum ada berita yang dipublikasikan.</p>}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/berita" className="bg-primary text-white font-bold py-3 px-6 rounded hover:bg-primary-dark transition-colors">
                           Lihat Semua Berita
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
