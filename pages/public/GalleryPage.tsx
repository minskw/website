import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GalleryAlbum } from '../../types';
import { Image, LoaderCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

const AlbumViewerModal: React.FC<{ album: GalleryAlbum; onClose: () => void }> = ({ album, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? album.images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === album.images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{album.title}</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black"><X /></button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 relative">
                    {album.images.length > 1 && (
                        <>
                            <button onClick={goToPrevious} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 p-2 rounded-full hover:bg-white"><ChevronLeft /></button>
                            <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 p-2 rounded-full hover:bg-white"><ChevronRight /></button>
                        </>
                    )}
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img 
                            src={album.images[currentIndex].imageUrl} 
                            alt={album.images[currentIndex].caption} 
                            className="max-w-full max-h-full object-contain"
                        />
                         <p className="mt-2 text-center text-sm text-gray-600 bg-gray-100 p-2 rounded-md w-full">{album.images[currentIndex].caption}</p>
                    </div>
                </div>
                 <div className="text-center p-2 text-sm text-gray-500">{currentIndex + 1} / {album.images.length}</div>
            </div>
        </div>
    );
};

const GalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            setIsLoading(true);
            const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const albumData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryAlbum));
            setAlbums(albumData);
            setIsLoading(false);
        };
        fetchAlbums();
    }, []);

    return (
        <>
            <div className="bg-light">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
                        <Image size={36} /> Galeri Sekolah
                    </h1>
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <LoaderCircle className="animate-spin text-primary" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {albums.map((album) => (
                                <div key={album.id} onClick={() => setSelectedAlbum(album)} className="group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white">
                                    <div className="relative h-56">
                                         <img src={album.images[0]?.imageUrl} alt={album.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-md font-bold font-poppins text-gray-800 truncate">{album.title}</h3>
                                        <p className="text-sm text-gray-500">{album.images.length} foto</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                     {albums.length === 0 && !isLoading && (
                        <p className="text-center text-gray-500 mt-8">Belum ada album galeri yang diunggah.</p>
                    )}
                </div>
            </div>
            {selectedAlbum && <AlbumViewerModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
        </>
    );
};

export default GalleryPage;