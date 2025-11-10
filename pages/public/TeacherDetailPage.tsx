import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Teacher } from '../../types';
import { ArrowLeft, Book, Trophy, GraduationCap, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const TeacherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeacher = async () => {
            if (!id) {
                setError('Teacher ID is missing.');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError('');
            try {
                const docRef = doc(db, 'teachers', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTeacher({ ...docSnap.data(), id: docSnap.id } as Teacher);
                } else {
                    setError('Guru tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat data guru.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeacher();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }
    
    if (!teacher) {
        return <div className="text-center py-20">Guru tidak ditemukan.</div>;
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <Link to="/gtk" className="inline-flex items-center text-primary hover:underline mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Daftar Guru
                    </Link>

                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <img 
                                src={teacher.imageUrl} 
                                alt={teacher.name} 
                                className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-md flex-shrink-0"
                            />
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold font-poppins text-gray-900">{teacher.name}</h1>
                                <p className="text-xl text-primary font-semibold mt-1">{teacher.position}</p>
                                <p className="text-md text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-2">
                                    <Book size={18} className="text-secondary" /> 
                                    Mengajar: {teacher.subject}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 border-t pt-8">
                            <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
                        </div>
                        
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2">
                                    <GraduationCap className="text-primary"/> Riwayat Pendidikan
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {teacher.education?.map((edu, index) => <li key={index}>{edu}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h2 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2">
                                    <Trophy className="text-primary"/> Prestasi & Penghargaan
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {teacher.achievements?.map((ach, index) => <li key={index}>{ach}</li>)}
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
