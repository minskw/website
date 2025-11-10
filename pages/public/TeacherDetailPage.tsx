import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Teacher } from '../../types';
import { Award, GraduationCap, ArrowLeft, LoaderCircle } from 'lucide-react';

const TeacherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            if (id) {
                setIsLoading(true);
                const docRef = doc(db, 'teachers', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTeacher({ ...docSnap.data(), id: docSnap.id } as Teacher);
                }
                setIsLoading(false);
            }
        };
        fetchTeacher();
    }, [id]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    if (!teacher) {
        return (
            <div className="text-center py-20">
                <p>Data guru tidak ditemukan.</p>
                <Link to="/gtk" className="mt-4 inline-block text-primary hover:underline">Kembali ke Daftar Guru</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <Link to="/gtk" className="inline-flex items-center gap-2 text-primary font-semibold mb-6 hover:underline">
                    <ArrowLeft size={18} /> Kembali ke Daftar GTK
                </Link>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 p-8 bg-primary text-white text-center flex flex-col justify-center items-center">
                            <img src={teacher.imageUrl} alt={teacher.name} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg" />
                            <h1 className="text-3xl font-bold font-poppins mt-4">{teacher.name}</h1>
                            <p className="text-green-200 mt-1">{teacher.position}</p>
                            <p className="text-green-100 font-semibold mt-2">{teacher.subject}</p>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Profil Lengkap</h2>
                            <p className="text-gray-600 leading-relaxed mb-8">{teacher.bio}</p>

                            {teacher.education && teacher.education.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold font-poppins text-gray-700 mb-3 flex items-center gap-2"><GraduationCap className="text-secondary" /> Riwayat Pendidikan</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {teacher.education.map((edu, index) => <li key={index}>{edu}</li>)}
                                    </ul>
                                </div>
                            )}

                             {teacher.achievements && teacher.achievements.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold font-poppins text-gray-700 mb-3 flex items-center gap-2"><Award className="text-secondary" /> Prestasi & Penghargaan</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                       {teacher.achievements.map((ach, index) => <li key={index}>{ach}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDetailPage;
