import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Link as LinkIcon, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ImportantLink } from '../../types';

const Footer: React.FC = () => {
  const [importantLinks, setImportantLinks] = useState<ImportantLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const docRef = doc(db, 'settings', 'schoolInfo');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.importantLinks && Array.isArray(data.importantLinks)) {
            setImportantLinks(data.importantLinks);
          }
        }
      } catch (error) {
        console.error("Failed to fetch important links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Column 1: School Identity & Social Media */}
          <div>
            <div className="flex items-center mb-4">
              <img src={SCHOOL_INFO.logo} alt="Logo" className="h-12 w-12 mr-3" />
              <span className="font-bold text-xl">{SCHOOL_INFO.name}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {SCHOOL_INFO.motto}
            </p>
            <div className="flex space-x-4 mt-4">
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <Facebook size={20} />
                </a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <Instagram size={20} />
                </a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <span className="sr-only">YouTube</span>
                  <Youtube size={20} />
                </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                     <span className="w-2 h-0.5 bg-primary"></span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Penting</h3>
            {isLoading ? <LoaderCircle className="animate-spin" /> : (
              <ul className="space-y-2">
                {importantLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <LinkIcon size={14} className="flex-shrink-0" /> {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom section: 2 columns */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="text-sm text-gray-400 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All Rights Reserved.
          </div>
          <div className="text-sm text-gray-400">
            Developed by <span className="font-semibold text-white">MAHFUD SIDIK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;