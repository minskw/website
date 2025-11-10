import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { UserCheck, Newspaper, Users, Settings, LoaderCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PpdbStatus } from '../../types';

interface Stats {
  newApplicants: number;
  newsCount: number;
  teacherCount: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; link: string; color: string }> = ({ icon, title, value, link, color }) => (
    <Link to={link} className={`block p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-white/80">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="text-white/50">{icon}</div>
        </div>
    </Link>
);


const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const applicantsQuery = query(collection(db, 'ppdb_applicants'), where('status', '==', PpdbStatus.WAITING));
        const newsQuery = collection(db, 'news');
        const teachersQuery = collection(db, 'teachers');

        const [applicantsSnap, newsSnap, teachersSnap] = await Promise.all([
          getCountFromServer(applicantsQuery),
          getCountFromServer(newsQuery),
          getCountFromServer(teachersQuery),
        ]);

        setStats({
          newApplicants: applicantsSnap.data().count,
          newsCount: newsSnap.data().count,
          teacherCount: teachersSnap.data().count,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Selamat datang kembali, {user?.username}!</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<UserCheck size={40} />} title="Pendaftar Baru" value={stats.newApplicants} link="/admin/ppdb" color="bg-blue-500" />
            <StatCard icon={<Newspaper size={40} />} title="Total Berita" value={stats.newsCount} link="/admin/berita" color="bg-green-500" />
            <StatCard icon={<Users size={40} />} title="Total Guru" value={stats.teacherCount} link="/admin/guru" color="bg-yellow-500" />
        </div>
      ) : (
        <p className="text-center text-red-500">Gagal memuat statistik dashboard.</p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to="/admin/ppdb" className="text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <UserCheck className="mx-auto text-primary" size={32} />
                <span className="mt-2 block text-sm font-medium text-gray-700">Manajemen PPDB</span>
            </Link>
            <Link to="/admin/berita" className="text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Newspaper className="mx-auto text-primary" size={32} />
                <span className="mt-2 block text-sm font-medium text-gray-700">Manajemen Berita</span>
            </Link>
            <Link to="/admin/guru" className="text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Users className="mx-auto text-primary" size={32} />
                <span className="mt-2 block text-sm font-medium text-gray-700">Manajemen Guru</span>
            </Link>
             <Link to="/admin/pengaturan" className="text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="mx-auto text-primary" size={32} />
                <span className="mt-2 block text-sm font-medium text-gray-700">Pengaturan</span>
            </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
