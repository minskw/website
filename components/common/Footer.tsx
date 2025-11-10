import React from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img src={SCHOOL_INFO.logo} alt="Logo" className="h-16 w-16 bg-white p-1 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold font-poppins">{SCHOOL_INFO.name}</h2>
                <p className="text-sm text-green-200">{SCHOOL_INFO.affiliation}</p>
              </div>
            </div>
            <p className="text-green-100">{SCHOOL_INFO.address}</p>
            <p className="text-green-100 mt-2">Email: {SCHOOL_INFO.email}</p>
            <p className="text-green-100">Telepon: {SCHOOL_INFO.phone}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-green-100 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-dark py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-green-200">
          &copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
