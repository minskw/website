
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockNews, mockTeachers, mockGallery, mockPpdbApplicants } from '../../services/mockApi';
import { PpdbStatus } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Newspaper, Users, Image, UserCheck, PenSquare, UserPlus } from 'lucide-react';

const StatCard: React.FC<{ title: string, value: number, icon: React.ReactNode, color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);


const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();

    const ppdbStats = mockPpdbApplicants.reduce((acc, applicant) => {
        acc[applicant.status] = (acc[applicant.status] || 0) + 1;
        return acc;
    }, {} as Record<PpdbStatus, number>);

    const pieData = [
        { name: 'Menunggu', value: ppdbStats[PpdbStatus.WAITING] || 0 },
        { name: 'Diterima', value: ppdbStats[PpdbStatus.ACCEPTED] || 0 },
        { name: 'Ditolak', value: ppdbStats[PpdbStatus.REJECTED] || 0 },
        { name: 'Terverifikasi', value: ppdbStats[PpdbStatus.VERIFIED] || 0 },
    ];
    const COLORS = ['#FFBB28', '#00C49F', '#FF8042', '#0088FE'];

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">Selamat datang kembali, {user?.username}!</p>

        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Aksi Cepat</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/admin/berita" className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto font-semibold">
                    <PenSquare size={18} /> Tambah Berita
                </Link>
                <Link to="/admin/guru" className="flex items-center justify-center gap-2 bg-secondary text-primary font-semibold px-4 py-3 rounded-lg hover:bg-yellow-400 transition-colors w-full sm:w-auto">
                    <UserPlus size={18} /> Tambah Guru
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Pendaftar PPDB" value={mockPpdbApplicants.length} icon={<UserCheck className="text-white" />} color="bg-blue-500" />
            <StatCard title="Total Berita" value={mockNews.length} icon={<Newspaper className="text-white" />} color="bg-green-500" />
            <StatCard title="Total Guru" value={mockTeachers.length} icon={<Users className="text-white" />} color="bg-yellow-500" />
            <StatCard title="Total Foto Galeri" value={mockGallery.length} icon={<Image className="text-white" />} color="bg-purple-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Statistik Pendaftar PPDB</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Pendaftar Terbaru</h2>
                <ul className="space-y-3">
                    {mockPpdbApplicants.slice(0, 5).map(app => (
                        <li key={app.id} className="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-100">
                           <div>
                             <p className="font-semibold text-gray-800">{app.fullName}</p>
                             <p className="text-gray-500">{app.registrationNumber}</p>
                           </div>
                           <span className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full bg-gray-200">{app.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboardPage;