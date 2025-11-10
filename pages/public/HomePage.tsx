import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO } from '../../constants';
import { mockNews, mockGallery, ppdbSchedule } from '../../services/mockApi';
import { ArrowRight, BookOpen, Star, Users, LoaderCircle } from 'lucide-react';
import { HomepageContent } from '../../types';

// Firebase imports
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const NewsCard: React.FC<{ article: typeof mockNews[0] }> = ({ article }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
        <div className="p-6">
            <span className="text-xs font-semibold text-primary bg-green-100 px-2 py-1 rounded-full">{article.category}</span>
            <h3 className="mt-2 text-lg font-bold font-poppins text-gray-800 h-14 overflow-hidden">{article.title}</h3>
            <p className="mt-2 text-gray-600 text-sm h-20 overflow-hidden">{article.excerpt}</p>
            <Link to={`/berita/${article.id}`} className="mt-4 inline-flex items-center font-semibold text-primary hover:text-primary-dark">
                Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomepageContent = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'settings', 'homepageContent');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setHomepageContent(docSnap.data() as HomepageContent);
            } else {
                console.log("No homepage content settings found!");
            }
            setIsLoading(false);
        };
        fetchHomepageContent();
    }, []);

    const today = new Date();
    const startDate = new Date(ppdbSchedule.startDate + 'T00:00:00');
    const endDate = new Date(ppdbSchedule.endDate + 'T23:59:59');
    const isRegistrationOpen = today >= startDate && today <= endDate;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
        );
    }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[60vh] text-white flex items-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${homepageContent?.heroImageUrl}')` }}
      >
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-poppins drop-shadow-lg animate-fade-in-down">{SCHOOL_INFO.name}</h1>
          <p className="mt-4 text-lg md:text-2xl font-semibold text-secondary drop-shadow-md animate-fade-in-up">{`"${SCHOOL_INFO.motto}"`}</p>
          {isRegistrationOpen ? (
                <Link to="/ppdb" className="mt-8 inline-block bg-secondary text-primary font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300">
                    Daftar PPDB Sekarang
                </Link>
            ) : (
                <div className="mt-8 inline-block bg-gray-600 bg-opacity-80 text-white font-bold py-3 px-8 rounded-full shadow-lg">
                    {today < startDate ? `Pendaftaran PPDB Dibuka ${startDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}` : 'Pendaftaran PPDB Telah Ditutup'}
                </div>
            )}
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <img src={homepageContent?.welcomeImageUrl} alt="Gedung Sekolah" className="rounded-lg shadow-2xl w-full"/>
            </div>
            <div>
                <h2 className="text-3xl font-bold font-poppins text-primary mb-4">{homepageContent?.welcomeTitle}</h2>
                <p className="text-gray-600 mb-4">
                    {homepageContent?.welcomeText}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3"><BookOpen className="text-secondary" size={24}/> <span>Kurikulum Terpadu</span></div>
                    <div className="flex items-center gap-3"><Star className="text-secondary" size={24}/> <span>Akreditasi Unggul</span></div>
                    <div className="flex items-center gap-3"><Users className="text-secondary" size={24}/> <span>Tenaga Pendidik Profesional</span></div>
                    <div className="flex items-center gap-3"><Star className="text-secondary" size={24}/> <span>Lingkungan Islami</span></div>
                </div>
                 <Link to="/profil" className="mt-8 inline-flex items-center font-semibold text-primary bg-green-100 py-2 px-4 rounded-md hover:bg-green-200 transition-colors">
                    Selengkapnya Tentang Kami <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-poppins text-primary mb-8">Berita Terbaru</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockNews.slice(0, 3).map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Mini */}
      <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold font-poppins text-primary mb-8">Galeri Kegiatan</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {mockGallery.slice(0, 6).map((img, index) => (
                      <div key={img.id} className="overflow-hidden rounded-lg shadow-md">
                          <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
                      </div>
                  ))}
              </div>
              <Link to="/galeri" className="mt-8 inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                  Lihat Semua Galeri
              </Link>
          </div>
      </section>

    </div>
  );
};

export default HomePage;