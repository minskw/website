
import React from 'react';
import { SCHOOL_INFO } from '../../constants';

const AdminSettingsPage: React.FC = () => {
    
    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Pengaturan berhasil disimpan! (Simulasi)');
    }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Website</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Informasi Umum</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Nama Sekolah</label><input type="text" defaultValue={SCHOOL_INFO.name} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Moto Sekolah</label><input type="text" defaultValue={SCHOOL_INFO.motto} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Alamat</label><textarea defaultValue={SCHOOL_INFO.address} className={inputClass}></textarea></div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Kontak & Media Sosial</h2>
           <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" defaultValue={SCHOOL_INFO.email} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Telepon</label><input type="tel" defaultValue={SCHOOL_INFO.phone} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Link Facebook</label><input type="url" defaultValue="https://facebook.com" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-gray-700">Link Instagram</label><input type="url" defaultValue="https://instagram.com" className={inputClass} /></div>
           </div>
        </div>

        <div>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                Simpan Perubahan
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
