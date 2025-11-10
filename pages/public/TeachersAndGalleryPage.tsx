
import React, { useState } from 'react';
import { mockTeachers, mockGallery } from '../../services/mockApi';
import { Camera, Users } from 'lucide-react';

const TeacherCard: React.FC<{ teacher: typeof mockTeachers[0] }> = ({ teacher }) => (
    <div className="bg-white text-center p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <img
            src={teacher.imageUrl}
            alt={teacher.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-secondary"
        />
        <h3 className="text-lg font-bold font-poppins text-primary">{teacher.name}</h3>
        <p className="text-gray-600 font-semibold">{teacher.position}</p>
        <p className="text-sm text-gray-500 mt-1">{teacher.subject}</p>
    </div>
);

const TeachersAndGalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'gallery'>('teachers');

  return (
    <div className="bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Guru & Galeri</h1>
        
        <div className="mb-8 flex justify-center border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
              activeTab === 'teachers'
                ? 'border-b-4 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <Users />
            Data Guru
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
              activeTab === 'gallery'
                ? 'border-b-4 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <Camera />
            Galeri Kegiatan
          </button>
        </div>

        {activeTab === 'teachers' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {mockTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockGallery.map(image => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img src={image.imageUrl} alt={image.caption} className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersAndGalleryPage;