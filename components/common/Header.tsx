import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS, SOCIAL_LINKS } from '../../constants';
import { Menu, X, Search } from 'lucide-react';

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
    <header className="text-dark font-sans">
      {/* Top Bar */}
      <div className="bg-[--sch-main-color] text-white h-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full topwrapper">
          <div className="lg:w-1/2"></div>
          <div className="lg:w-1/2 flex justify-between items-center h-full">
            <div className="topbox bg-[--sch-main-color] h-10 leading-10 px-4 ml-[25%] w-full z-10">
              <marquee className="text-sm">Selamat datang di portal Info MIN Singkawang, the only one madrasah negeri in Singkawang | Hebat bermartabat, Mandiri Berprestasi</marquee>
            </div>
            <div className="hidden lg:flex items-center space-x-3 pr-4 z-10">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[--sch-teks-color-yellow]"><i className="fab fa-facebook-f"></i></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[--sch-teks-color-yellow]"><i className="fab fa-instagram"></i></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[--sch-teks-color-yellow]"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`bg-white w-full z-50 transition-all duration-300 border-t-7 border-[--sch-main-color] ${isSticky ? 'fixed top-0 shadow-lg' : 'relative -top-28 shadow-sm'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[50px]">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 -mt-10 mr-12">
                <img className="h-11 w-auto" src={SCHOOL_INFO.logo} alt={`Logo ${SCHOOL_INFO.name}`} />
              </Link>
            </div>
            
            <div className="hidden lg:flex flex-grow items-center justify-between">
              <nav className="flex items-baseline space-x-2">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `px-2.5 leading-[50px] text-sm font-normal transition-colors duration-200 uppercase ${
                        isActive
                          ? 'text-[--sch-main-color]'
                          : 'text-dark hover:text-[--sch-main-color]'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
              <div className="flex items-center">
                <button className="p-2 text-dark hover:text-[--sch-main-color]">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-primary focus:outline-none"
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
                      isActive ? 'bg-primary text-white' : 'text-dark hover:bg-gray-100'
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
export default Header;
