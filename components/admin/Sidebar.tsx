import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ADMIN_NAV_LINKS, SCHOOL_INFO } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:static lg:inset-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src={SCHOOL_INFO.logo} alt="Logo" className="h-10 w-10 rounded-full bg-white p-1" />
            <span className="text-lg font-semibold">{SCHOOL_INFO.name}</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {ADMIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
           <div className="mb-2 text-sm text-gray-400">
               <p className="font-semibold">{user?.username}</p>
               <p>{user?.role}</p>
           </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
