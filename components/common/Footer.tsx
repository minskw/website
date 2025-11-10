import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SchoolInfoSettings } from '../../types';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SchoolInfoSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    return () => unsubscribe();
  }, []);

  const info = settings?.info;
  const socialLinks = settings?.socialLinks;
  const importantLinks = settings?.importantLinks || [];

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoaderCircle className="animate-spin text-white" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: School Identity & Social Media */}
            <div className="md:col-span-1">
              {info && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={info.logo} alt="Logo" className="h-12 w-12 bg-white p-1 rounded-full" />
                    <div>
                      <h3 className="text-xl font-bold font-poppins">{info.name}</h3>
                      <p className="text-sm text-gray-400">{info.affiliation}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <p className="flex items-start gap-2"><MapPin size={18} className="mt-1 flex-shrink-0" /> {info.address}</p>
                    <p className="flex items-center gap-2"><Phone size={18} /> {info.phone}</p>
                    <p className="flex items-center gap-2"><Mail size={18} /> {info.email}</p>
                  </div>
                </>
              )}
              {socialLinks && (
                 <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Ikuti Kami</h4>
                    <div className="flex space-x-4">
                      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Facebook size={24} /></a>
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Instagram size={24} /></a>
                      <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Youtube size={24} /></a>
                    </div>
                  </div>
              )}
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(link => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-300 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Important Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Penting</h4>
              {importantLinks.length > 0 ? (
                <ul className="space-y-2">
                  {importantLinks.map(link => (
                    <li key={link.name}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">Tidak ada tautan penting.</p>
              )}
            </div>

          </div>
        )}
      </div>
      <div className="bg-primary-dark py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-300 flex flex-col md:flex-row justify-between items-center text-center">
          <p>&copy; {new Date().getFullYear()} {info?.name || 'MIN Singkawang'}. All Rights Reserved.</p>
          <Link to="/admin/login" className="mt-2 md:mt-0 hover:text-white transition-colors">
            Developed by MAHFUD SIDIK
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;