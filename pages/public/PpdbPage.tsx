import React, { useState, FormEvent } from 'react';
import { mockPpdbApplicants } from '../../services/mockApi';
import { PpdbApplicant } from '../../types';
import { CheckCircle, Clock, XCircle, FileText, UserPlus, Search } from 'lucide-react';

type View = 'info' | 'form' | 'status' | 'result';

const PpdbInfo: React.FC<{ setView: (view: View) => void }> = ({ setView }) => (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold font-poppins text-primary mb-4">Informasi PPDB 2024/2025</h2>
        <div className="space-y-4 text-gray-700">
            <div>
                <h3 className="font-semibold text-lg">Jadwal Pendaftaran</h3>
                <p>Pendaftaran: 5 Juli - 20 Juli 2024</p>
                <p>Verifikasi Berkas: 21 - 23 Juli 2024</p>
                <p>Pengumuman Hasil: 25 Juli 2024</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg">Syarat Pendaftaran</h3>
                <ul className="list-disc list-inside">
                    <li>Usia minimal 6 tahun pada 1 Juli 2024</li>
                    <li>Fotokopi Kartu Keluarga (KK)</li>
                    <li>Fotokopi Akta Kelahiran</li>
                    <li>Fotokopi Ijazah TK/RA (jika ada)</li>
                    <li>Pas foto 3x4 (2 lembar)</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg">Alur Pendaftaran</h3>
                <ol className="list-decimal list-inside">
                    <li>Mengisi formulir pendaftaran online.</li>
                    <li>Mengunggah dokumen persyaratan.</li>
                    <li>Menerima nomor pendaftaran.</li>
                    <li>Mengecek status pendaftaran secara berkala.</li>
                    <li>Melihat pengumuman hasil seleksi.</li>
                </ol>
            </div>
        </div>
        <button onClick={() => setView('form')} className="mt-8 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2">
            <UserPlus /> Lanjutkan ke Formulir Pendaftaran
        </button>
    </div>
);

const PpdbForm: React.FC<{ setView: (view: View) => void, setApplicantResult: (applicant: PpdbApplicant) => void }> = ({ setView, setApplicantResult }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        nik: '',
        gender: 'Laki-laki',
        birthPlace: '',
        birthDate: '',
        address: '',
        fatherName: '',
        motherName: '',
        parentJob: '',
        phone: '',
        originSchool: '',
        docKk: null,
        docAkta: null,
        docIjazah: null,
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    const validate = () => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.fullName.trim() || formData.fullName.length < 3) newErrors.fullName = 'Nama lengkap harus diisi (minimal 3 karakter).';
        if (!formData.nik.trim() || !/^\d{10,16}$/.test(formData.nik)) newErrors.nik = 'NIK / NISN harus berupa 10-16 digit angka.';
        if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Tempat lahir harus diisi.';
        if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir harus diisi.';
        if (!formData.address.trim() || formData.address.length < 10) newErrors.address = 'Alamat lengkap harus diisi (minimal 10 karakter).';
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Nama ayah harus diisi.';
        if (!formData.motherName.trim()) newErrors.motherName = 'Nama ibu harus diisi.';
        if (!formData.parentJob.trim()) newErrors.parentJob = 'Pekerjaan orang tua harus diisi.';
        if (!formData.phone.trim() || !/^08\d{8,11}$/.test(formData.phone)) newErrors.phone = 'Nomor HP harus valid (contoh: 081234567890).';
        if (!formData.docKk) newErrors.docKk = 'Kartu Keluarga wajib diupload.';
        if (!formData.docAkta) newErrors.docAkta = 'Akta Kelahiran wajib diupload.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Mock submission
            const newApplicant = { ...mockPpdbApplicants[1], registrationNumber: `PPDB24${Math.floor(1000 + Math.random() * 9000)}`, fullName: formData.fullName };
            setApplicantResult(newApplicant);
            setView('result');
        }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if(files && files.length > 0){
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            if (errors[name as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [name]: undefined }));
            }
        }
    }
    
    const getInputClass = (fieldName: keyof typeof formData) => 
        `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            errors[fieldName] ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-primary'
        }`;
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold font-poppins text-primary mb-6">Formulir Pendaftaran Siswa Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-3">
                    <div><label className="block text-sm font-medium text-gray-700">Nama Lengkap</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={getInputClass('fullName')} />{errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">NIK / NISN</label><input type="text" name="nik" value={formData.nik} onChange={handleChange} className={getInputClass('nik')} />{errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label><select name="gender" value={formData.gender} onChange={handleChange} className={getInputClass('gender')}><option>Laki-laki</option><option>Perempuan</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700">Agama</label><input type="text" value="Islam" readOnly className={`${getInputClass('nik')} bg-gray-100`} /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Tempat Lahir</label><input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} className={getInputClass('birthPlace')} />{errors.birthPlace && <p className="text-red-500 text-xs mt-1">{errors.birthPlace}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label><input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={getInputClass('birthDate')} />{errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}</div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label><textarea name="address" value={formData.address} onChange={handleChange} className={getInputClass('address')}></textarea>{errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}</div>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-3">
                    <div><label className="block text-sm font-medium text-gray-700">Nama Ayah</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className={getInputClass('fatherName')} />{errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">Nama Ibu</label><input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className={getInputClass('motherName')} />{errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">Pekerjaan Orang Tua</label><input type="text" name="parentJob" value={formData.parentJob} onChange={handleChange} className={getInputClass('parentJob')} />{errors.parentJob && <p className="text-red-500 text-xs mt-1">{errors.parentJob}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700">Nomor HP Aktif</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={getInputClass('phone')} />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Asal Sekolah (TK/RA)</label><input type="text" name="originSchool" value={formData.originSchool} onChange={handleChange} className={getInputClass('originSchool')} /></div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Upload Dokumen (PDF/JPG)</label>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-xs">Kartu Keluarga (KK)*</label><input type="file" name="docKk" onChange={handleFileChange} className="text-sm w-full"/>{errors.docKk && <p className="text-red-500 text-xs mt-1">{errors.docKk}</p>}</div>
                        <div><label className="text-xs">Akta Kelahiran*</label><input type="file" name="docAkta" onChange={handleFileChange} className="text-sm w-full"/>{errors.docAkta && <p className="text-red-500 text-xs mt-1">{errors.docAkta}</p>}</div>
                        <div><label className="text-xs">Ijazah TK/RA</label><input type="file" name="docIjazah" onChange={handleFileChange} className="text-sm w-full"/></div>
                    </div>
                </div>
                <button type="submit" className="w-full bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center gap-2">
                    <FileText /> Kirim Pendaftaran
                </button>
            </form>
        </div>
    );
};

const PpdbStatusCheck: React.FC<{ setView: (view: View) => void, setApplicantResult: (applicant: PpdbApplicant | null) => void }> = ({ setView, setApplicantResult }) => {
    const [regNum, setRegNum] = useState('');
    
    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        const found = mockPpdbApplicants.find(app => app.registrationNumber.toLowerCase() === regNum.toLowerCase());
        setApplicantResult(found || null);
        setView('result');
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold font-poppins text-primary mb-4">Cek Status Pendaftaran</h2>
            <p className="text-gray-600 mb-6">Masukkan Nomor Pendaftaran atau NIK Anda untuk melihat status.</p>
            <form onSubmit={handleCheck} className="max-w-md mx-auto">
                <input 
                    type="text" 
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    placeholder="Contoh: PPDB24001" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                />
                <button type="submit" className="mt-4 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2">
                    <Search /> Cek Status
                </button>
            </form>
        </div>
    );
}

const PpdbResult: React.FC<{ applicant: PpdbApplicant | null }> = ({ applicant }) => {
    if (!applicant) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-poppins text-red-700 mb-2">Data Tidak Ditemukan</h2>
                <p className="text-gray-600">Nomor pendaftaran yang Anda masukkan tidak valid. Silakan coba lagi.</p>
            </div>
        );
    }

    const statusInfo = {
        'Menunggu Verifikasi': { icon: <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4"/>, color: 'text-yellow-700', bg: 'bg-yellow-100', text: 'Pendaftaran Anda telah kami terima dan sedang menunggu proses verifikasi oleh panitia. Mohon cek secara berkala.'},
        'Terverifikasi': { icon: <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4"/>, color: 'text-blue-700', bg: 'bg-blue-100', text: 'Berkas Anda telah berhasil diverifikasi. Silakan tunggu pengumuman hasil seleksi.'},
        'Diterima': { icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>, color: 'text-green-700', bg: 'bg-green-100', text: 'Selamat! Anda dinyatakan DITERIMA sebagai siswa baru MIN Singkawang. Informasi daftar ulang akan diumumkan selanjutnya.'},
        'Ditolak': { icon: <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>, color: 'text-red-700', bg: 'bg-red-100', text: 'Mohon maaf, Anda belum dapat kami terima saat ini. Terima kasih atas partisipasinya.'},
    }

    const currentStatus = statusInfo[applicant.status];

    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            {currentStatus.icon}
            <h2 className={`text-2xl font-bold font-poppins ${currentStatus.color} mb-2`}>Status: {applicant.status}</h2>
            <p className="text-gray-600 mb-6">{currentStatus.text}</p>
            <div className={`p-4 rounded-lg text-left ${currentStatus.bg} max-w-lg mx-auto`}>
                <p><strong>No. Pendaftaran:</strong> {applicant.registrationNumber}</p>
                <p><strong>Nama Lengkap:</strong> {applicant.fullName}</p>
                <p><strong>Asal Sekolah:</strong> {applicant.originSchool}</p>
            </div>
        </div>
    );
}

const PpdbPage: React.FC = () => {
    const [view, setView] = useState<View>('info');
    const [applicantResult, setApplicantResult] = useState<PpdbApplicant | null>(null);

    const renderView = () => {
        switch (view) {
            case 'info': return <PpdbInfo setView={setView} />;
            case 'form': return <PpdbForm setView={setView} setApplicantResult={setApplicantResult} />;
            case 'status': return <PpdbStatusCheck setView={setView} setApplicantResult={setApplicantResult} />;
            case 'result': return <PpdbResult applicant={applicantResult} />;
            default: return <PpdbInfo setView={setView} />;
        }
    }

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-4">PPDB Online</h1>
                <p className="text-center text-gray-600 mb-10">Penerimaan Peserta Didik Baru MIN Singkawang</p>
                
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {renderView()}
                    </div>
                    <div className="space-y-4">
                        <button onClick={() => setView('info')} className="w-full bg-white p-4 rounded-lg shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50">Informasi PPDB</button>
                        <button onClick={() => setView('form')} className="w-full bg-white p-4 rounded-lg shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50">Formulir Pendaftaran</button>
                        <button onClick={() => setView('status')} className="w-full bg-white p-4 rounded-lg shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50">Cek Status</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PpdbPage;
