import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockTeachers, mockGallery } from '../../services/mockApi';
import { Teacher, GalleryImage } from '../../types';
import { Camera, Users, X } from 'lucide-react';

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

const ImageModal: React.FC<{ image: GalleryImage; onClose: () => void }> = ({ image, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={image.imageUrl}
                    alt={image.caption}
                    className="max-w-full max-h-[calc(90vh-80px)] object-contain rounded-md"
                />
                <p className="text-center mt-3 text-gray-800 bg-gray-100 p-2 rounded-b-md">{image.caption}</p>
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Tutup gambar"
                >
                    <X size={24} />
                </button>
            </div>
        </div>
    );
};

const GalleryGrid: React.FC<{ onImageClick: (image: GalleryImage) => void }> = ({ onImageClick }) => {
    if (!mockGallery || mockGallery.length === 0) {
        return <p className="text-center text-gray-500">Galeri kosong.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockGallery.map((image) => (
                <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => onImageClick(image)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onImageClick(image)}
                    aria-label={`Lihat gambar: ${image.caption}`}
                >
                    <img
                        src={image.imageUrl}
                        alt={image.caption}
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end p-2">
                        <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                            {image.caption}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};


const TeachersAndGalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'gallery'>('teachers');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
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
            <GalleryGrid onImageClick={setSelectedImage} />
          </div>
        )}
      </div>
    </div>
    {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

export default TeachersAndGalleryPage;