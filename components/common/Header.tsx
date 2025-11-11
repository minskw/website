import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 70);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="text-dark font-open-sans">
      {/* Top Bar */}
      <div className="bg-primary text-white h-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="w-full lg:w-3/4 overflow-hidden">
            <marquee className="text-sm">Selamat datang di portal Info MIN Singkawang, the only one madrasah negeri in Singkawang | Hebat bermartabat, Mandiri Berprestasi</marquee>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-secondary"><i className="fab fa-facebook-f"></i></a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-secondary"><i className="fab fa-instagram"></i></a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-secondary"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`bg-white shadow-sm w-full z-50 transition-all duration-300 border-t-8 border-primary ${isSticky ? 'fixed top-0 animate-fade-in-down' : 'relative'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <img className="h-14 w-14" src={SCHOOL_INFO.logo} alt={`Logo ${SCHOOL_INFO.name}`} />
                <div>
                  <h1 className="text-xl font-bold text-primary">{SCHOOL_INFO.name}</h1>
                  <p className="text-xs text-gray-500 -mt-1">KALIMANTAN BARAT</p>
                </div>
              </Link>
            </div>
            <div className="hidden lg:block">
              <nav className="ml-10 flex items-baseline space-x-6">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-colors duration-200 uppercase ${
                        isActive
                          ? 'text-primary'
                          : 'text-dark hover:text-primary'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-primary inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive ? 'bg-primary text-white' : 'text-dark hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// FIX: Added default export to resolve "Module has no default export" error.
export default Header;
