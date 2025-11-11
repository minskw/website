import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SchoolInfoSettings } from '../../types';
import { LoaderCircle, ChevronUp } from 'lucide-react';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SchoolInfoSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);

    const docRef = doc(db, 'settings', 'schoolInfo');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SchoolInfoSettings);
      } else {
        console.warn("School info settings not found in Firestore.");
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to fetch footer settings:", error);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const info = settings?.info;
  const socialLinks = settings?.socialLinks;
  const importantLinks = settings?.importantLinks || [];

  return (
    <>
      <footer id='footer' className="bg-[--sch-main-color] text-white font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <LoaderCircle className="animate-spin text-white" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Column 1: School Identity */}
              <div className="pr-8 border-r-0 lg:border-r-2 border-white/20">
                {info && (
                    <img src={info.logo} alt="Logo" className="h-10 w-auto mb-4" />
                )}
                <h3 className="text-lg font-bold">Mendidik generasi penerus bangsa</h3>
              </div>

              {/* Column 2: Address */}
              <div>
                <h3 className="text-lg font-bold mb-4">Alamat Sekolah</h3>
                <p className="text-sm text-gray-200">{info?.address}</p>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
                <p className="text-sm text-gray-200">T. {info?.phone}</p>
                <p className="text-sm text-gray-200">E. {info?.email}</p>
              </div>

              {/* Column 4: Social Media */}
              <div>
                <h3 className="text-lg font-bold mb-4">Media Sosial</h3>
                 {socialLinks && (
                    <div className="flex space-x-2">
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/50 rounded-md text-white hover:bg-white hover:text-dark transition-colors"><i className="fab fa-facebook-f"></i></a>
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/50 rounded-md text-white hover:bg-white hover:text-dark transition-colors"><i className="fab fa-instagram"></i></a>
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/50 rounded-md text-white hover:bg-white hover:text-dark transition-colors"><i className="fab fa-youtube"></i></a>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </footer>
      <div id='credit' className="bg-white py-6 text-center text-sm text-dark">
        <p>2022-{new Date().getFullYear()} &copy; <a href='/' className="hover:text-primary">{info?.name || 'MIN Singkawang'}</a> - All Rights Reserved</p> 
      </div>
      <button onClick={scrollToTop} className={`backtop ${showBackTop ? 'show' : ''}`} title="Back to Top">
        <ChevronUp />
      </button>
    </>
  );
};

export default Footer;
