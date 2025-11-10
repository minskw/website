import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Eye, Target, Users, LoaderCircle } from 'lucide-react';

interface ProfileContent {
    vision: string;
    mission: string;
    orgChartUrl: string;
}

const ProfilePage: React.FC = () => {
    const [content, setContent] = useState<ProfileContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'settings', 'profileContent');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(docSnap.data() as ProfileContent);
            }
            setIsLoading(false);
        };
        fetchContent();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><LoaderCircle className="animate-spin text-primary" size={48} /></div>;
    }

    if (!content) {
        return <div className="text-center py-20">Konten profil tidak ditemukan.</div>;
    }

    const missionItems = content.mission.split('\n').filter(item => item.trim() !== '');

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Profil Sekolah</h1>
                
                <div className="space-y-12">
                    {/* Visi */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-3">
                            <Eye className="text-secondary" /> Visi
                        </h2>
                        <p className="text-gray-600 text-lg italic">"{content.vision}"</p>
                    </div>

                    {/* Misi */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-3">
                            <Target className="text-secondary" /> Misi
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            {missionItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Struktur Organisasi */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-3">
                            <Users className="text-secondary" /> Struktur Organisasi
                        </h2>
                        <div className="mt-4">
                            <img src={content.orgChartUrl} alt="Struktur Organisasi" className="w-full h-auto rounded-md border" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
