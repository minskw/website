
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Public Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Admin Components
import Sidebar from './components/admin/Sidebar';
import AdminHeader from './components/admin/AdminHeader';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProfilePage from './pages/public/ProfilePage';
import NewsPage from './pages/public/NewsPage';
import GtkPage from './pages/public/GtkPage';
import TeacherDetailPage from './pages/public/TeacherDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import EventCalendarPage from './pages/public/EventCalendarPage';
import PpdbPage from './pages/public/PpdbPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPpdbPage from './pages/admin/AdminPpdbPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminTeachersPage from './pages/admin/AdminTeachersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';

// Layout for public pages
const PublicLayout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20"> {/* pt-20 for fixed header */}
            <Outlet />
        </main>
        <Footer />
    </div>
);

// Layout for admin pages
const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

// Protected Route for Admin
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/berita" element={<NewsPage />} />
            <Route path="/berita/:id" element={<NewsPage />} />
            <Route path="/gtk" element={<GtkPage />} />
            <Route path="/guru/:id" element={<TeacherDetailPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/kalender-kegiatan" element={<EventCalendarPage />} />
            <Route path="/ppdb" element={<PpdbPage />} />
            <Route path="/kontak" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/ppdb" element={<AdminPpdbPage />} />
            <Route path="/admin/berita" element={<AdminNewsPage />} />
            <Route path="/admin/galeri" element={<AdminGalleryPage />} />
            <Route path="/admin/guru" element={<AdminTeachersPage />} />
            <Route path="/admin/pengaturan" element={<AdminSettingsPage />} />
            <Route path="/admin/setup" element={<AdminSetupPage />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
