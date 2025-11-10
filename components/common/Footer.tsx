import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO, NAV_LINKS } from '../../constants';
import { Facebook, Instagram, Youtube, LoaderCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface SchoolInfoData {
  info: {
    name: string;
    address: string;
    email: string;
    phone: string;
    logo: string;
    affiliation: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

const Footer: React.FC = () => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfoData | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const docRef = doc(db, "settings", "schoolInfo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSchoolInfo(docSnap.data() as SchoolInfoData);
        }
      } catch (error) {
        console.error("Failed to fetch school info for footer:", error);
      }
    };
    fetchInfo();
  }, []);

  if (!schoolInfo) {
    return (
       <footer className="bg-primary text-white py-12 text-center">
         <LoaderCircle className="animate-spin inline-block" />
       </footer>
    );
  }

  const { info, socialLinks } = schoolInfo;

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img src={info.logo} alt="Logo" className="h-16 w-16 bg-white p-1 rounded-md" />
              <div>
                <h2 className="text-xl font-bold font-poppins">{info.name}</h2>
                <p className="text-sm text-green-200">{info.affiliation || 'Kementerian Agama Republik Indonesia'}</p>
              </div>
            </div>
            <p className="text-sm mb-2">{info.address}</p>
            <p className="text-sm mb-2">Email: <a href={`mailto:${info.email}`} className="hover:underline">{info.email}</a></p>
            <p className="text-sm">Telepon: <a href={`tel:${info.phone}`} className="hover:underline">{info.phone}</a></p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Tautan Cepat</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm hover:underline">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Facebook size={24} />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Instagram size={24} />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-dark py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-green-200 gap-2">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} {info.name}. All rights reserved.</p>
          <p className="text-center sm:text-right font-semibold">Developed by MAHFUD SIDIK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;