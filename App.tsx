import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './hooks/useAuth';
import { ParentAuthProvider, ParentAuthContext } from './hooks/useParentAuth';
import { SCHOOL_INFO } from './constants';
import { LogOut, Wallet, LayoutDashboard } from 'lucide-react';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/admin/Sidebar';

import HomePage from './pages/public/HomePage';
import ProfilePage from './pages/public/ProfilePage';
import NewsPage from './pages/public/NewsPage';
import TeachersAndGalleryPage from './pages/public/TeachersAndGalleryPage';
import TeacherDetailPage from './pages/public/TeacherDetailPage';
import PpdbPage from './pages/public/PpdbPage';
import ContactPage from './pages/public/ContactPage';
import EventCalendarPage from './pages/public/EventCalendarPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPpdbPage from './pages/admin/AdminPpdbPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminTeachersPage from './pages/admin/AdminTeachersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import ParentLoginPage from './pages/portal/ParentLoginPage';
import ParentDashboardPage from './pages/portal/ParentDashboardPage';
import ParentPaymentsPage from './pages/portal/ParentPaymentsPage';

const PublicLayout: React.FC = () => (
  <div className="font-nunito-sans bg-light text-dark">
    <Header />
    <main className="min-h-screen pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const PortalHeader: React.FC = () => {
    const parentAuth = useContext(ParentAuthContext);
    if (!parentAuth) return null;
    const { parent, student, logout } = parentAuth;

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3">
                        <img className="h-12 w-12" src={SCHOOL_INFO.logo} alt="Logo MIN SINGKAWANG" />
                        <div>
                            <h1 className="text-lg font-bold text-primary font-poppins">Portal Wali Murid</h1>
                            <p className="text-xs text-gray-500">{SCHOOL_INFO.name}</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        {parent && student && (
                            <div className="text-right hidden sm:block">
                                <p className="font-semibold text-gray-800">{parent.name}</p>
                                <p className="text-sm text-gray-500">Wali dari {student.name} (Kelas {student.class})</p>
                            </div>
                        )}
                        <button onClick={logout} className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors">
                           <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const PortalNav: React.FC = () => {
    const location = useLocation();
    const navLinks = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: <LayoutDashboard size={18}/> },
        { name: 'Pembayaran', href: '/portal/pembayaran', icon: <Wallet size={18}/> },
    ];

    return (
        <div className="bg-white shadow-sm mb-6 rounded-lg">
            <nav className="flex items-center gap-2 p-2">
                {navLinks.map(link => (
                     <Link
                        key={link.name}
                        to={link.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                            location.pathname.startsWith(link.href)
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-green-100 hover:text-primary'
                        }`}
                     >
                        {link.icon} <span className="hidden sm:inline">{link.name}</span>
                     </Link>
                ))}
            </nav>
        </div>
    );
}


const PortalLayout: React.FC = () => (
    <div className="font-nunito-sans bg-gray-100">
        <PortalHeader />
        <main className="min-h-screen pt-24 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PortalNav />
                <Outlet />
            </div>
        </main>
    </div>
);


const AdminLayout: React.FC = () => (
  <div className="flex h-screen bg-gray-100 font-nunito-sans">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (auth?.loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!auth?.user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ParentProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const parentAuth = useContext(ParentAuthContext);
    const location = useLocation();

    if(parentAuth?.loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if(!parentAuth?.parent) {
        return <Navigate to="/portal/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ParentAuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profil" element={<ProfilePage />} />
              <Route path="berita" element={<NewsPage />} />
              <Route path="berita/:id" element={<NewsPage />} />
              <Route path="guru-dan-galeri" element={<TeachersAndGalleryPage />} />
              <Route path="guru/:id" element={<TeacherDetailPage />} />
              <Route path="kalender-kegiatan" element={<EventCalendarPage />} />
              <Route path="ppdb" element={<PpdbPage />} />
              <Route path="kontak" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="login" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="ppdb" element={<AdminPpdbPage />} />
                <Route path="berita" element={<AdminNewsPage />} />
                <Route path="guru" element={<AdminTeachersPage />} />
                <Route path="pengaturan" element={<AdminSettingsPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Parent Portal Routes */}
            <Route path="/portal/login" element={<ParentLoginPage />} />
            <Route
                path="/portal"
                element={
                    <ParentProtectedRoute>
                        <PortalLayout />
                    </ParentProtectedRoute>
                }
            >
                <Route path="dashboard" element={<ParentDashboardPage />} />
                <Route path="pembayaran" element={<ParentPaymentsPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
            </Route>


            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ParentAuthProvider>
    </AuthProvider>
  );
};

export default App;