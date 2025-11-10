import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { HomepageContent, NewsArticle } from '../../types';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { SCHOOL_INFO } from '../../constants';

const HomePage: React.FC = () => {
    const [content, setContent] = useState<HomepageContent | null>(null);
    const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch homepage content
                const contentDocRef = doc(db, 'settings', 'homepageContent');
                const contentDoc = await getDoc(contentDocRef);
                if (contentDoc.exists()) {
                    setContent(contentDoc.data() as HomepageContent);
                } else {
                     console.warn("Homepage content not found in Firestore. Please run initial setup.");
                }

                // Fetch latest news
                const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
                const newsSnap = await getDocs(newsQuery);
                const newsData = newsSnap.docs.map(d => ({ ...d.data(), id: d.id } as NewsArticle));
                setLatestNews(newsData);

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
    
    // Fallback content if Firestore data is missing
    const displayContent = content || {
        heroImageUrl: 'https://images.unsplash.com/photo-1576765682835-a73c552096e2?q=80&w=2070&auto=format&fit=crop',
        welcomeTitle: `Selamat Datang di ${SCHOOL_INFO.name}`,
        welcomeText: 'Kami berkomitmen untuk memberikan pendidikan berkualitas...',
        welcomeImageUrl: 'https://images.unsplash.com/photo-1594400273525-242d20bcca6b?q=80&w=1974&auto=format&fit=crop'
    };


    return (
        <div className="bg-light">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[60vh] text-white flex items-center justify-center"
                style={{ backgroundImage: `url(${displayContent.heroImageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
                <div className="relative text-center z-10 px-4 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-poppins leading-tight drop-shadow-md">Mewujudkan Generasi Cerdas dan Berakhlak Mulia</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-sm">Pendidikan berkualitas yang mengintegrasikan ilmu pengetahuan dan nilai-nilai keislaman.</p>
                    <Link to="/ppdb" className="mt-8 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105 shadow-lg">
                        Daftar PPDB Sekarang
                    </Link>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in-left">
                            <h2 className="text-3xl font-bold font-poppins text-primary mb-4">{displayContent.welcomeTitle}</h2>
                            <p className="text-gray-700 leading-relaxed text-base">{displayContent.welcomeText}</p>
                            <Link to="/profil" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-transform hover:translate-x-1">
                                Selengkapnya tentang kami <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="animate-fade-in-right">
                            <img src={displayContent.welcomeImageUrl} alt="Gedung Sekolah" className="rounded-lg shadow-xl w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Latest News */}
            <section className="py-20 bg-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-poppins text-center text-primary mb-12">Berita Terkini</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {latestNews.length > 0 ? latestNews.map((news, index) => (
                            <div key={news.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                                <Link to={`/berita/${news.id}`} className="block">
                                    <img src={news.imageUrl} alt={news.title} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <span className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <h3 className="font-bold text-lg mt-2 mb-3 h-14 overflow-hidden text-gray-800">{news.title}</h3>
                                        <span className="font-semibold text-primary hover:underline">Baca Selengkapnya</span>
                                    </div>
                                </Link>
                            </div>
                        )) : <p className="col-span-3 text-center text-gray-500">Belum ada berita yang dipublikasikan.</p>}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/berita" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                           Lihat Semua Berita
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;