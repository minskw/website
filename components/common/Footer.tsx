
import React from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* School Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={SCHOOL_INFO.logo} alt="Logo" className="h-12 w-12 bg-white p-1 rounded-full" />
              <div>
                <h3 className="text-xl font-bold font-poppins">{SCHOOL_INFO.name}</h3>
                <p className="text-sm text-gray-400">{SCHOOL_INFO.affiliation}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{SCHOOL_INFO.motto}</p>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start gap-2"><MapPin size={18} className="mt-1 flex-shrink-0" /> {SCHOOL_INFO.address}</p>
              <p className="flex items-center gap-2"><Phone size={18} /> {SCHOOL_INFO.phone}</p>
              <p className="flex items-center gap-2"><Mail size={18} /> {SCHOOL_INFO.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Facebook size={24} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Instagram size={24} /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors"><Youtube size={24} /></a>
            </div>
          </div>

        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
