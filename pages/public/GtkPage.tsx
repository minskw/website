import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Teacher } from '../../types';
import { Users, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => (
  <div className="bg-white rounded-lg shadow-md text-center p-6 transform hover:-translate-y-2 transition-transform duration-300">
    <img src={teacher.imageUrl} alt={teacher.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary" />
    <h3 className="text-xl font-bold font-poppins text-gray-800">{teacher.name}</h3>
    <p className="text-primary font-semibold">{teacher.position}</p>
    <p className="text-gray-500 text-sm mt-1">{teacher.subject}</p>
    <Link to={`/guru/${teacher.id}`} className="mt-4 inline-block bg-green-100 text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-200 transition-colors">
      Lihat Profil
    </Link>
  </div>
);

const GtkPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            setIsLoading(true);
            const teachersCollectionRef = collection(db, "teachers");
            const q = query(teachersCollectionRef, orderBy("name")); // Order by name for consistency
            const data = await getDocs(q);
            const teachersData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Teacher));
            setTeachers(teachersData);
            setIsLoading(false);
        };
        fetchTeachers();
    }, []);

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Users size={36} />
                    Guru & Tenaga Kependidikan
                </h1>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderCircle className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {teachers.map(teacher => (
                            <TeacherCard key={teacher.id} teacher={teacher} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GtkPage;
