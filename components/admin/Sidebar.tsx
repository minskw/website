
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SCHOOL_INFO, ADMIN_NAV_LINKS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const sidebarContent = (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center p-4 border-b border-gray-700 h-20">
          <img src={SCHOOL_INFO.logo} alt="Logo" className={`h-10 w-10 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span className="text-white text-md font-bold whitespace-nowrap">{SCHOOL_INFO.name.split('(')[0]}</span>}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {ADMIN_NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => isMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                  isActive ? 'bg-primary text-white' : ''
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {link.icon}
              {!isCollapsed && <span className="ml-3 whitespace-nowrap">{link.name}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-gray-700">
            { !isCollapsed && user && (
                <div className="p-2 mb-2 text-center text-sm text-gray-300 rounded-md bg-gray-700">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-xs">{user.role}</p>
                </div>
            )}
          <button
            onClick={handleLogout}
            className={`flex items-center p-2 text-gray-300 rounded-md hover:bg-red-600 hover:text-white w-full transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3 whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    );


  return (
    <>
      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-4 fixed top-2 left-2 z-20 bg-primary text-white rounded-full shadow-lg">
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-800`}>
        {sidebarContent}
        <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 text-white">
            <ChevronLeft size={24} />
        </button>
      </div>
      <div className={`fixed inset-0 bg-black opacity-50 z-30 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileOpen(false)}></div>

      {/* Desktop Sidebar */}
      <div className={`relative hidden md:flex flex-shrink-0 bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full focus:outline-none"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
