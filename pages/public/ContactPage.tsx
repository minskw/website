import React from 'react';
import { SCHOOL_INFO } from '../../constants';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Hubungi Kami</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">Kirim Pesan</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan</label>
                <textarea id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                Kirim
              </button>
            </form>
          </div>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Informasi Kontak</h2>
                <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-secondary flex-shrink-0 mt-1"/>
                        <span>{SCHOOL_INFO.address}</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-secondary flex-shrink-0"/>
                        <span>{SCHOOL_INFO.phone}</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-secondary flex-shrink-0"/>
                        <span>{SCHOOL_INFO.email}</span>
                    </div>
                </div>
            </div>
             <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.892795328084!2d108.9734185749667!3d0.8437996991319748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31e2bff111be0745%3A0x630a91a9a838382d!2sJl.%20Marhaban%2C%20Sedau%2C%20Kec.%20Singkawang%20Sel.%2C%20Kota%20Singkawang%2C%20Kalimantan%20Barat!5e0!3m2!1sen!2sid!4v1721545839958!5m2!1sen!2sid"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi MIN Singkawang"
                ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;