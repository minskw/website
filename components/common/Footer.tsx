
import React from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={SCHOOL_INFO.logo} alt="Logo MIN Singkawang" className="h-16 w-16 mr-4" />
              <div>
                <h2 className="text-xl font-bold font-poppins text-white">{SCHOOL_INFO.name}</h2>
                <p className="text-sm text-gray-300">{SCHOOL_INFO.motto}</p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">{SCHOOL_INFO.address}</p>
            <p className="text-gray-400 mt-2">Email: {SCHOOL_INFO.email}</p>
            <p className="text-gray-400 mt-2">Telepon: {SCHOOL_INFO.phone}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white font-poppins tracking-wider uppercase">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-gray-300 hover:text-secondary transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white font-poppins tracking-wider uppercase">Media Sosial</h3>
            <div className="mt-4 flex space-x-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary">
                <Facebook size={24} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary">
                <Instagram size={24} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
