import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GalleryImage } from '../../types';
import { Image, LoaderCircle } from 'lucide-react';

const GalleryPage: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [categories, setCategories] = useState<string[]>(['Semua']);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const imageData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
            setImages(imageData);
            
            const uniqueCategories = ['Semua', ...new Set(imageData.map(img => img.category))];
            setCategories(uniqueCategories);
            setIsLoading(false);
        };
        fetchImages();
    }, []);

    const filteredImages = selectedCategory === 'Semua' 
        ? images 
        : images.filter(image => image.category === selectedCategory);

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Image size={36} /> Galeri Sekolah
                </h1>
                
                {/* Category Filter */}
                <div className="flex justify-center flex-wrap gap-2 mb-8">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                selectedCategory === category 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-gray-700 hover:bg-green-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderCircle className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map((image) => (
                            <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                                <img src={image.imageUrl} alt={image.caption} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm">{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 {filteredImages.length === 0 && !isLoading && (
                    <p className="text-center text-gray-500 mt-8">Tidak ada foto di kategori ini.</p>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;
