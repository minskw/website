import React, { useState, useMemo, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { Camera, X, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

const GalleryGrid: React.FC<{ images: GalleryImage[]; onImageClick: (image: GalleryImage) => void }> = ({ images, onImageClick }) => {
    if (!images || images.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Tidak ada gambar yang cocok dengan kategori ini.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
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

const GalleryPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            setIsLoadingGallery(true);
            const galleryCollectionRef = collection(db, "gallery");
            const q = query(galleryCollectionRef, orderBy("caption"));
            const data = await getDocs(q);
            const imagesData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryImage));
            setGalleryImages(imagesData);
            setIsLoadingGallery(false);
        };
        fetchGallery();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const galleryCategories = useMemo(() => ['Semua', ...Array.from(new Set(galleryImages.map(img => img.category)))], [galleryImages]);
    
    const filteredImages = useMemo(() => {
        if (selectedCategory === 'Semua') {
            return galleryImages;
        }
        return galleryImages.filter(image => image.category === selectedCategory);
    }, [selectedCategory, galleryImages]);

    return (
        <>
            <div className="bg-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <Camera size={36} />
                        Galeri Kegiatan
                    </h1>
                    {isLoadingGallery ? (
                        <div className="flex justify-center items-center py-20">
                            <LoaderCircle className="animate-spin text-primary" size={40} />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {galleryCategories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm transition-colors duration-200 ${
                                            selectedCategory === category
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <GalleryGrid images={filteredImages} onImageClick={setSelectedImage} />
                        </>
                    )}
                </div>
            </div>
            {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </>
    );
};

export default GalleryPage;
