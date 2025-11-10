import React from 'react';
import { Link } from 'react-router-dom';
import { mockTeachers } from '../../services/mockApi';
import { Teacher } from '../../types';
import { Users } from 'lucide-react';

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => (
    <div className="bg-white text-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <img
            src={teacher.imageUrl}
            alt={teacher.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-secondary"
        />
        <div className="flex-grow">
            <h3 className="text-lg font-bold font-poppins text-primary">{teacher.name}</h3>
            <p className="text-gray-600 font-semibold">{teacher.position}</p>
            <p className="text-sm text-gray-500 mt-1">{teacher.subject}</p>
        </div>
        <Link 
            to={`/guru/${teacher.id}`} 
            className="mt-4 bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
            Lihat Profil
        </Link>
    </div>
);

const GtkPage: React.FC = () => {
  return (
    <div className="bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
            <Users size={36} />
            Guru & Tenaga Kependidikan
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {mockTeachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GtkPage;
