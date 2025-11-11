import React, { useState, useEffect } from 'react';
import { GalleryAlbum, VideoItem } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Image, Video, Tag, LoaderCircle, X, Youtube, Tv } from 'lucide-react';

const getYoutubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : '';
};

const getEmbedUrl = (type: 'youtube' | 'google-drive', url: string) => {
    if (type === 'youtube') {
        const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
    }
    if (type === 'google-drive') {
        const fileId = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
        return fileId ? `https://drive.google.com/file/d/${fileId[1]}/preview` : '';
    }
    return '';
}

const GalleryLightbox: React.FC<{ item: GalleryAlbum | VideoItem | null; type: 'photos' | 'videos'; onClose: () => void }> = ({ item, type, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-black bg-white/70 rounded-full p-1 z-10 hover:bg-white transition-colors">
                    <X size={24} />
                </button>
                {type === 'photos' && item && 'images' in item ? (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">{(item as GalleryAlbum).title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(item as GalleryAlbum).images.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden border">
                                    <img src={image.imageUrl} alt={image.caption || 'Gallery image'} className="w-full h-48 object-cover" />
                                    {image.caption && <p className="text-xs text-gray-600 bg-gray-50 p-2">{image.caption}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">{(item as VideoItem).title}</h2>
                        <div className="aspect-video">
                            <iframe
                                src={getEmbedUrl((item as VideoItem).type, (item as VideoItem).url)}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                title={(item as VideoItem).title}
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AlbumCard: React.FC<{ album: GalleryAlbum; onClick: () => void }> = ({ album, onClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer" onClick={onClick}>
        <div className="relative">
            <img 
                src={album.images[0]?.imageUrl || 'https://via.placeholder.com/400x300.png?text=Album+Kosong'} 
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

const VideoCard: React.FC<{ video: VideoItem; onClick: () => void }> = ({ video, onClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer" onClick={onClick}>
        <div className="relative">
            <img 
                src={video.thumbnailUrl || 'https://via.placeholder.com/400x300.png?text=Video'} 
                alt={video.title} 
                className="w-full h-48 object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                 {video.type === 'youtube' ? <Youtube size={40} className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" /> : <Tv size={40} className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />}
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-dark">{video.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <Tag size={14} />
                {video.type === 'youtube' ? 'YouTube' : 'Google Drive'}
            </p>
        </div>
    </div>
);


const GalleryPage: React.FC = () => {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryAlbum | VideoItem | null>(null);
    const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const albumsQuery = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
                const albumsSnap = await getDocs(albumsQuery);
                setAlbums(albumsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryAlbum)));

                const videosQuery = query(collection(db, "videos"), orderBy("createdAt", "desc"));
                const videosSnap = await getDocs(videosQuery);
                setVideos(videosSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as VideoItem)));
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-sans text-center text-primary mb-10 flex items-center justify-center gap-3">
                    Galeri Sekolah
                </h1>

                <div className="flex justify-center border-b mb-8">
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={`px-6 py-3 font-semibold ${activeTab === 'photos' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    >
                        <Image className="inline-block mr-2" size={20} /> Foto
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-6 py-3 font-semibold ${activeTab === 'videos' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    >
                        <Video className="inline-block mr-2" size={20} /> Video
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderCircle className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div>
                        {activeTab === 'photos' && (
                             albums.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {albums.map(album => (
                                        <AlbumCard key={album.id} album={album} onClick={() => setSelectedItem(album)} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 mt-8">Belum ada album foto yang dipublikasikan.</p>
                            )
                        )}
                        {activeTab === 'videos' && (
                             videos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {videos.map(video => (
                                        <VideoCard key={video.id} video={video} onClick={() => setSelectedItem(video)} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 mt-8">Belum ada video yang dipublikasikan.</p>
                            )
                        )}
                    </div>
                )}
            </div>
            {selectedItem && <GalleryLightbox item={selectedItem} type={activeTab} onClose={() => setSelectedItem(null)} />}
        </div>
    );
};

export default GalleryPage;