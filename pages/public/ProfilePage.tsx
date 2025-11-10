import React from 'react';
import { SCHOOL_INFO } from '../../constants';
import { mockTeachers } from '../../services/mockApi';
import { Eye, Flag, Building } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const headmaster = mockTeachers.find(t => t.position === 'Kepala Madrasah');

  return (
    <div className="bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Profil {SCHOOL_INFO.name}</h1>

        {/* Sejarah */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10 flex flex-col md:flex-row items-center gap-8">
            <Building className="w-20 h-20 text-secondary flex-shrink-0" />
            <div>
                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-3">Sejarah Singkat</h2>
                <p className="text-gray-600">
                    {SCHOOL_INFO.name} didirikan pada tahun {SCHOOL_INFO.founded} sebagai respons atas kebutuhan masyarakat akan pendidikan dasar Islam yang berkualitas. Berawal dari sebuah bangunan sederhana, {SCHOOL_INFO.name} terus berkembang menjadi salah satu madrasah unggulan di Kota Singkawang, dengan fasilitas yang memadai dan prestasi yang membanggakan baik di bidang akademik maupun non-akademik.
                </p>
            </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-3">
                    <Eye className="w-10 h-10 text-secondary" />
                    <h2 className="text-2xl font-bold font-poppins text-gray-800">Visi</h2>
                </div>
                <p className="text-gray-600">Terwujudnya peserta didik yang berakhlak mulia, cerdas, terampil, dan berprestasi berdasarkan iman dan takwa.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-3">
                    <Flag className="w-10 h-10 text-secondary" />
                    <h2 className="text-2xl font-bold font-poppins text-gray-800">Misi</h2>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Menanamkan akidah dan akhlak mulia melalui pembiasaan.</li>
                    <li>Mengoptimalkan proses pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.</li>
                    <li>Mengembangkan potensi siswa di bidang akademik dan non-akademik.</li>
                    <li>Menciptakan lingkungan madrasah yang religius, aman, dan nyaman.</li>
                </ul>
            </div>
        </div>

        {/* Struktur Organisasi & Kepala Sekolah */}
        <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Struktur Organisasi</h2>
                <img src="https://via.placeholder.com/800x500.png?text=Bagan+Struktur+Organisasi" alt="Struktur Organisasi" className="rounded-lg w-full"/>
            </div>
            {headmaster && (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Kepala Madrasah</h2>
                    <img src={headmaster.imageUrl} alt={headmaster.name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-secondary"/>
                    <h3 className="text-xl font-bold text-primary">{headmaster.name}</h3>
                    <p className="text-gray-500">{headmaster.position}</p>
                    <p className="mt-4 text-sm text-gray-600 italic">"Pendidikan adalah kunci untuk membuka dunia, sebuah paspor untuk kebebasan. Mari kita bersama-sama mendidik anak bangsa menjadi generasi yang unggul dan berakhlak."</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;