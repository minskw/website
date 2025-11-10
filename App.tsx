import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Public components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/public/HomePage';
import ProfilePage from './pages/public/ProfilePage';
import NewsPage from './pages/public/NewsPage';
import GtkPage from './pages/public/GtkPage';
import TeacherDetailPage from './pages/public/TeacherDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import EventCalendarPage from './pages/public/EventCalendarPage';
import PpdbPage from './pages/public/PpdbPage';
import ContactPage from './pages/public/ContactPage';

// Admin components
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPpdbPage from './pages/admin/AdminPpdbPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminTeachersPage from './pages/admin/AdminTeachersPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';
import Sidebar from './components/admin/Sidebar';
import AdminHeader from './components/admin/AdminHeader';
import { LoaderCircle } from 'lucide-react';

// Layouts
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="berita" element={<NewsPage />} />
            <Route path="berita/:id" element={<NewsPage />} />
            <Route path="gtk" element={<GtkPage />} />
            <Route path="guru/:id" element={<TeacherDetailPage />} />
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="kalender-kegiatan" element={<EventCalendarPage />} />
            <Route path="ppdb" element={<PpdbPage />} />
            <Route path="kontak" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="ppdb" element={<AdminPpdbPage />} />
            <Route path="berita" element={<AdminNewsPage />} />
            <Route path="galeri" element={<AdminGalleryPage />} />
            <Route path="guru" element={<AdminTeachersPage />} />
            <Route path="pengaturan" element={<AdminSettingsPage />} />
            <Route path="setup" element={<AdminSetupPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
