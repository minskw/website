import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTeachers } from '../../services/mockApi';
import { ArrowLeft, Award, GraduationCap, UserCircle } from 'lucide-react';

const TeacherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const teacher = mockTeachers.find(t => t.id === id);

    if (!teacher) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Guru tidak ditemukan.</h1>
                <Link to="/gtk" className="text-primary hover:underline mt-4 inline-block">
                    Kembali ke Daftar Guru
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/gtk" className="inline-flex items-center text-primary hover:underline mb-6 font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar Guru
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8 md:flex md:items-center md:gap-8 bg-primary bg-opacity-5">
                        <img 
                            src={teacher.imageUrl} 
                            alt={teacher.name} 
                            className="w-40 h-40 rounded-full mx-auto md:mx-0 object-cover border-4 border-white shadow-lg"
                        />
                        <div className="text-center md:text-left mt-4 md:mt-0">
                            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-primary">{teacher.name}</h1>
                            <p className="text-xl text-gray-600 font-semibold">{teacher.position}</p>
                            <p className="text-md text-gray-500 mt-1">Mengajar: {teacher.subject}</p>
                        </div>
                    </div>
                    
                    <div className="p-8 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-3 flex items-center gap-3"><UserCircle className="text-secondary"/>Profil Singkat</h2>
                                <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-3 flex items-center gap-3"><GraduationCap className="text-secondary"/>Riwayat Pendidikan</h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    {teacher.education.map((edu, index) => (
                                        <li key={index}>{edu}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-3 flex items-center gap-3"><Award className="text-secondary"/>Prestasi & Penghargaan</h2>
                                <ul className="list-disc list-inside text-gray-600 space-y-2">
                                    {teacher.achievements.map((ach, index) => (
                                        <li key={index}>{ach}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDetailPage;