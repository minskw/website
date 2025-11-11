import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { HomepageContent, NewsArticle } from '../../types';
import { LoaderCircle } from 'lucide-react';

const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      const duration = 2000; 
      const stepTime = Math.abs(Math.floor(duration / target));
      let currentCount = 0;
      
      const timer = setInterval(() => {
        currentCount += 1;
        setCount(currentCount);
        if (currentCount >= target) {
          clearInterval(timer);
          setCount(target); // Ensure it ends exactly on target
        }
      }, stepTime);
  
      return () => clearInterval(timer);
    }, [target]);
  
    return <span>{count}</span>;
};

const NewsCard: React.FC<{ article: NewsArticle, isPage: boolean }> = ({ article, isPage }) => {
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

                const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(4));
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
    
    const displayContent = content || {
        heroImageUrl: 'https://blogger.googleusercontent.com/img/a/AVvXsEhvUhvt2omPKy2GnbfGBhcwIulzWNsjTc2X_BVal-GUz7AVnZinzqdHfR3h7fVqM8S26pYqFF1ER3p4rPKmKRRSSOVoYaWYEz_aaNE6zZh4kzWFFxcuyaUnaohWtnei2k8SiN8rfaV-llmQiseEHCY8-8dgZAbtK1blNGdYeufkMuwwqlwzRN3M6fcvGEnh=s1600',
        welcomeTitle: `Selamat Datang di MIN Singkawang`,
        welcomeText: 'Membekali generasi penerus bangsa dengan dasar-dasar wawasan Pancasila dan Ke-Islam-an sehingga terwujud generasi bangsa yang Pancasilais dan Rahmatan Lil Alamin',
        welcomeImageUrl: 'https://blogger.googleusercontent.com/img/a/AVvXsEiQdpY7EUsh8mENLZ56Pqunz7QrCTrf4xpMg4eWACNZz5HGnQDxT_61jAlZ9wccskHTFuzMM-rPnFMyC5SeMViY7FkOSLcXm0Tk32k3JG_DCATUB_ossNhtE87-mWezU315A1hypMrkDAwN3dPK70Dqp1dfdy3zIBhl8-Kcf4OX-bV1qcHZ6m5YXN7gLw=s600'
    };

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[42.85vw] max-h-[600px] text-white flex items-center"
            >
                <div className="absolute inset-0 hero-overlay"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-full md:w-1/2 lg:w-2/5">
                         <h2 className="text-4xl md:text-5xl font-bold font-sans leading-tight drop-shadow-md">Penganugeragan Satya Lencana 10 dan 20 Tahun</h2>
                         <p className="mt-4 text-sm md:text-base max-w-3xl mx-auto drop-shadow-sm">pada HAB Kemenag RI ke 78 Tahun 2024 di Ponpes Ushuluddin Singkawang</p>
                    </div>
                </div>
            </section>

             {/* Welcome Section */}
            <section className="guru-wrapper py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                    <div className="guru md:w-[35%] mb-8 md:mb-0 text-center">
                        <div className="widget bg-[--sch-main-color] text-white p-5 relative z-0">
                            <h3 className="text-2xl font-bold mb-5">{displayContent.welcomeTitle}</h3>
                             <img src={displayContent.welcomeImageUrl} alt="Kepala Madrasah" className="w-full rounded shadow-lg"/>
                            <h3 className="font-bold text-xl mt-5">MUSLIMAH, S.Pd.I</h3>
                        </div>
                    </div>
                    <div className="guru md:w-[65%] md:pl-10">
                        <p className="mb-4 text-gray-700 leading-relaxed">{displayContent.welcomeText}</p>
                        <h3 className="text-xl font-bold font-sans mt-6 mb-2">Visi</h3>
                        <p className="text-gray-700 leading-relaxed">Membekali generasi penerus bangsa dengan dasar-dasar wawasan Pancasila dan Ke-Islam-an sehingga terwujud generasi bangsa yang Pancasilais dan Rahmatan Lil Alamin</p>
                    </div>
                </div>
            </section>
            
            {/* Statistics Section */}
            <section className="data-wrapper relative">
                <div className="bg bgopacity py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div id="dataschool2" className="bg-[--sch-body-color-yellow] p-10 rounded-lg shadow-[--sch-dataschool-box-shadow]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-dark">
                                <div className="element-counter">
                                    <div className="counter">
                                        <span className="icon-counter text-4xl mb-3 flex justify-center"><i className="fas fa-user-graduate"></i></span>
                                        <div className="counter-box text-2xl font-extrabold"><AnimatedCounter target={4570} /><span className="counter-plus">+</span></div>
                                        <span className="counter-title text-base">Lulusan</span>
                                    </div>
                                </div>
                                <div className="element-counter">
                                    <div className="counter">
                                        <span className="icon-counter text-4xl mb-3 flex justify-center"><i className="fas fa-chalkboard-user"></i></span>
                                        <div className="counter-box text-2xl font-extrabold"><AnimatedCounter target={27} /></div>
                                        <span className="counter-title text-base">Guru</span>
                                    </div>
                                </div>
                                <div className="element-counter">
                                    <div className="counter">
                                        <span className="icon-counter text-4xl mb-3 flex justify-center"><i className="fas fa-users"></i></span>
                                        <div className="counter-box text-2xl font-extrabold"><AnimatedCounter target={350} /><span className="counter-plus">+</span></div>
                                        <span className="counter-title text-base">Siswa Aktif</span>
                                    </div>
                                </div>
                                <div className="element-counter">
                                    <div className="counter">
                                        <span className="icon-counter text-4xl mb-3 flex justify-center"><i className="fas fa-memo-pad"></i></span>
                                        <div className="counter-box text-2xl font-extrabold"><AnimatedCounter target={20} /><span className="counter-plus">+</span></div>
                                        <span className="counter-title text-base">Extra Kurikuler</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Latest News */}
            <main className="main-wrapper py-12 md:py-20">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-wrapper text-center w-full max-w-xl mx-auto mb-12 relative">
                        <h2 className="widget-title text-3xl font-bold relative pb-2">Berita Terkini</h2>
                    </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {latestNews.length > 0 ? latestNews.map((news) => (
                            <NewsCard key={news.id} article={news} isPage={false} />
                        )) : <p className="col-span-full text-center text-gray-500">Belum ada berita yang dipublikasikan.</p>}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/berita" className="bg-primary text-white font-bold py-3 px-6 rounded hover:bg-primary-dark transition-colors">
                           Lihat Semua Berita
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;