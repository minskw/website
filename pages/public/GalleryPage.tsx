import React, { useState, useEffect } from 'react';
import { GalleryAlbum } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Image, Tag, LoaderCircle, X, Link as LinkIcon } from 'lucide-react';

const LightboxModal: React.FC<{ album: GalleryAlbum | null; onClose: () => void }> = ({ album, onClose }) => {
    if (!album) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-black bg-white/70 rounded-full p-1 z-10 hover:bg-white transition-colors">
                    <X size={24} />
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">{album.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {album.images.map((image, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border">
                                <img src={image.imageUrl} alt={image.caption || 'Gallery image'} className="w-full h-48 object-cover" />
                                {image.caption && <p className="text-xs text-gray-600 bg-gray-50 p-2">{image.caption}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlbumCard: React.FC<{ album: GalleryAlbum; onClick: () => void }> = ({ album, onClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer" onClick={onClick}>
        <div className="relative">
            <img 
                src={album.images[0]?.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'} 
                alt={album.title} 
                className="w-full h-48 object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                 <Image size={40} className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-dark">{album.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Tag size={14} />
                {album.category}
            </p>
        </div>
    </div>
);

const GalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            setIsLoading(true);
            const albumsCollectionRef = collection(db, "gallery_albums");
            const q = query(albumsCollectionRef, orderBy("createdAt", "desc"));
            const data = await getDocs(q);
            const albumsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryAlbum));
            setAlbums(albumsData);
            setIsLoading(false);
        };
        fetchAlbums();
    }, []);

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-sans text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Image size={36} />
                    Galeri Sekolah
                </h1>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderCircle className="animate-spin text-primary" size={40} />
                    </div>
                ) : albums.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map(album => (
                            <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-8">Belum ada album foto yang dipublikasikan.</p>
                )}
            </div>
            {selectedAlbum && <LightboxModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
        </div>
    );
};

export default GalleryPage;
