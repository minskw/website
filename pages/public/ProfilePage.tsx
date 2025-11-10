import React, { useState, useEffect } from 'react';
import { SCHOOL_INFO } from '../../constants';
import { Eye, Target, Users, LoaderCircle } from 'lucide-react';

// Firebase imports
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProfileContent {
    vision: string;
    mission: string;
    orgChartUrl: string;
}

const ProfilePage: React.FC = () => {
    const [profileContent, setProfileContent] = useState<ProfileContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileContent = async () => {
            setIsLoading(true);
            const docRef = doc(db, 'settings', 'profileContent');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfileContent(docSnap.data() as ProfileContent);
            } else {
                console.log("No profile content settings found!");
            }
            setIsLoading(false);
        };
        fetchProfileContent();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Profil {SCHOOL_INFO.name}</h1>
                
                <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
                    <h2 className="text-3xl font-bold font-poppins text-gray-800 mb-6 flex items-center gap-3"><Eye className="text-secondary" /> Visi</h2>
                    <p className="text-lg text-gray-600 italic">
                        "{profileContent?.vision}"
                    </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
                    <h2 className="text-3xl font-bold font-poppins text-gray-800 mb-6 flex items-center gap-3"><Target className="text-secondary" /> Misi</h2>
                    <ul className="list-disc list-inside space-y-3 text-lg text-gray-600">
                        {profileContent?.mission.split('\n').map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold font-poppins text-gray-800 mb-6 text-center flex items-center justify-center gap-3"><Users className="text-secondary" /> Struktur Organisasi</h2>
                    {profileContent?.orgChartUrl ? (
                        <img src={profileContent.orgChartUrl} alt="Struktur Organisasi" className="w-full h-auto rounded-md border" />
                    ) : (
                        <p className="text-center text-gray-500">Bagan struktur organisasi belum tersedia.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
