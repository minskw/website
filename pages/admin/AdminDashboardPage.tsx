import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, Newspaper, UserCheck, GalleryHorizontal, LoaderCircle } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; color: string }> = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border-l-4 ${color}`}>
        {icon}
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ teachers: 0, news: 0, applicants: 0, gallery: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const teachersPromise = getDocs(collection(db, 'teachers'));
                const newsPromise = getDocs(collection(db, 'news'));
                const applicantsPromise = getDocs(collection(db, 'ppdb_applicants'));
                const galleryPromise = getDocs(collection(db, 'gallery'));

                const [teachersSnap, newsSnap, applicantsSnap, gallerySnap] = await Promise.all([
                    teachersPromise,
                    newsPromise,
                    applicantsPromise,
                    galleryPromise,
                ]);
                
                setStats({
                    teachers: teachersSnap.size,
                    news: newsSnap.size,
                    applicants: applicantsSnap.size,
                    gallery: gallerySnap.size,
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
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-6">Selamat datang kembali, {user?.username}!</p>
            
            {isLoading ? (
                 <div className="flex justify-center items-center h-40"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        icon={<UserCheck size={32} className="text-blue-500" />}
                        title="Pendaftar PPDB"
                        value={stats.applicants}
                        color="border-blue-500"
                    />
                     <StatCard 
                        icon={<Newspaper size={32} className="text-green-500" />}
                        title="Total Berita"
                        value={stats.news}
                        color="border-green-500"
                    />
                     <StatCard 
                        icon={<Users size={32} className="text-yellow-500" />}
                        title="Jumlah Guru"
                        value={stats.teachers}
                        color="border-yellow-500"
                    />
                    <StatCard 
                        icon={<GalleryHorizontal size={32} className="text-purple-500" />}
                        title="Foto Galeri"
                        value={stats.gallery}
                        color="border-purple-500"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
