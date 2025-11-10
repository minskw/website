

import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './hooks/useAuth';
import { SCHOOL_INFO } from './constants';
import { Shield } from 'lucide-react';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/admin/Sidebar';

import HomePage from './pages/public/HomePage';
import ProfilePage from './pages/public/ProfilePage';
import NewsPage from './pages/public/NewsPage';
import GtkPage from './pages/public/GtkPage';
import GalleryPage from './pages/public/GalleryPage';
import TeacherDetailPage from './pages/public/TeacherDetailPage';
import PpdbPage from './pages/public/PpdbPage';
import ContactPage from './pages/public/ContactPage';
import EventCalendarPage from './pages/public/EventCalendarPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPpdbPage from './pages/admin/AdminPpdbPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminTeachersPage from './pages/admin/AdminTeachersPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';

const PublicLayout: React.FC = () => (
  <div className="font-nunito-sans bg-light text-dark">
    <Header />
    <main className="min-h-screen pt-20">
      <Outlet />
    </main>
    <Footer />
    {/* Admin Login FAB */}
    <Link
      to="/admin/login"
      title="Admin Login"
      className="group fixed bottom-8 right-8 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-110"
      aria-label="Admin Login"
    >
      <Shield size={24} />
      <span className="absolute bottom-1/2 translate-y-1/2 right-full mr-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Admin Login
      </span>
    </Link>
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

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profil" element={<ProfilePage />} />
              <Route path="berita" element={<NewsPage />} />
              <Route path="berita/:id" element={<NewsPage />} />
              <Route path="gtk" element={<GtkPage />} />
              <Route path="galeri" element={<GalleryPage />} />
              <Route path="guru/:id" element={<TeacherDetailPage />} />
              <Route path="kalender-kegiatan" element={<EventCalendarPage />} />
              <Route path="ppdb" element={<PpdbPage />} />
              <Route path="kontak" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/ppdb" element={<AdminPpdbPage />} />
              <Route path="/admin/berita" element={<AdminNewsPage />} />
              <Route path="/admin/galeri" element={<AdminGalleryPage />} />
              <Route path="/admin/guru" element={<AdminTeachersPage />} />
              <Route path="/admin/pengaturan" element={<AdminSettingsPage />} />
              <Route path="/admin/setup" element={<AdminSetupPage />} /> 
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;