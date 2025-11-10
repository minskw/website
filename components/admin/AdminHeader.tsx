import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, UserCircle } from 'lucide-react';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="relative z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center px-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="hidden lg:block ml-4 text-lg font-semibold text-gray-700">
          Admin Panel
        </div>
      </div>
      <div className="flex items-center px-4">
        <div className="flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-gray-400" />
            <div className="text-sm">
                <div className="font-medium text-gray-700">{user?.username}</div>
                <div className="text-gray-500">{user?.role}</div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
