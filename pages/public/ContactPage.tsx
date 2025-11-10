import React from 'react';
import { SCHOOL_INFO } from '../../constants';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2882196627683!2d108.97341351475354!3d0.8251239993351336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31e2c454e53188d5%3A0x6b41297e6b010b91!2sMIN%20Singkawang!5e0!3m2!1sen!2sid!4v1691234567890!5m2!1sen!2sid`;

  return (
    <div className="bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10">Hubungi Kami</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Info */}
            <div className="p-8">
              <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">{SCHOOL_INFO.name}</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Alamat</h3>
                    <p>{SCHOOL_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Telepon</h3>
                    <a href={`tel:${SCHOOL_INFO.phone}`} className="hover:text-primary">{SCHOOL_INFO.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-primary">{SCHOOL_INFO.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-80 md:h-full">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Sekolah"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
