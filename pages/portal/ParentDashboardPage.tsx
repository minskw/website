import React, { useState } from 'react';
import { useParentAuth } from '../../hooks/useParentAuth';
import { mockAcademicRecords, mockAttendanceRecords, mockSchoolAnnouncements, mockSemesterData } from '../../services/mockApi';
import { BookOpen, CalendarCheck, Megaphone, CheckCircle, XCircle, Clock, AlertTriangle, X, TrendingUp } from 'lucide-react';
import { SchoolAnnouncement, AcademicRecord } from '../../types';

const StudentProfileCard: React.FC = () => {
    const { student } = useParentAuth();
    if (!student) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
            <img src={student.imageUrl} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary" />
            <div>
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">{student.name}</h2>
                <p className="text-gray-600">Kelas: <span className="font-semibold">{student.class}</span></p>
                <p className="text-gray-600">Jenjang: <span className="font-semibold">Kelas {student.grade}</span></p>
            </div>
        </div>
    );
};

const AnnouncementCard: React.FC<{ announcement: SchoolAnnouncement }> = ({ announcement }) => (
    <div className="bg-green-50 border-l-4 border-primary p-4 rounded-r-lg">
        <div className="flex items-center gap-3">
            <Megaphone className="text-primary" />
            <h3 className="font-bold text-primary">{announcement.title}</h3>
        </div>
        <p className="text-sm text-gray-700 mt-2 ml-8">{announcement.content}</p>
        <p className="text-xs text-gray-500 mt-2 text-right">{announcement.date}</p>
    </div>
);

const getAttendanceIcon = (status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa') => {
    switch (status) {
        case 'Hadir': return <CheckCircle className="text-green-500" />;
        case 'Sakit': return <Clock className="text-yellow-500" />;
        case 'Izin': return <AlertTriangle className="text-blue-500" />;
        case 'Alpa': return <XCircle className="text-red-500" />;
    }
};

const AttendanceCard: React.FC = () => {
    const latestRecords = mockAttendanceRecords.slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2">
                <CalendarCheck className="text-secondary" /> Absensi Terakhir
            </h3>
            <div className="space-y-2">
                {latestRecords.length > 0 ? latestRecords.map((record, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                        <p className="text-gray-700">{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <div className="flex items-center gap-2">
                            {getAttendanceIcon(record.status)}
                            <span className="font-semibold text-gray-600">{record.status}</span>
                        </div>
                    </div>
                )) : (
                     <p className="text-center text-gray-500 py-4">Tidak ada data kehadiran.</p>
                )}
            </div>
        </div>
    );
};

const AcademicDetailModal: React.FC<{ record: AcademicRecord | null; onClose: () => void; }> = ({ record, onClose }) => {
    if (!record) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full relative transform transition-all" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold font-poppins text-primary mb-4">Detail Nilai: {record.subject}</h3>
                <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">Nilai Akhir:</span>
                        <span className={`font-bold text-lg ${record.score >= 75 ? 'text-green-600' : 'text-red-600'}`}>{record.score}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">Guru Pengajar:</span>
                        <span>{record.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Tanggal Penilaian:</span>
                        <span>{new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
                 <button onClick={onClose} className="mt-6 w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    Tutup
                </button>
            </div>
        </div>
    );
};

const SemesterPerformanceCard: React.FC = () => {
    const [selectedSemesterId, setSelectedSemesterId] = useState(mockSemesterData[0].semesterId);

    const selectedSemesterData = mockSemesterData.find(s => s.semesterId === selectedSemesterId);

    if (!selectedSemesterData) {
        return <div className="bg-white p-6 rounded-lg shadow-md"><p>Data semester tidak ditemukan.</p></div>;
    }

    const averageScore = selectedSemesterData.records.reduce((acc, record) => acc + record.score, 0) / selectedSemesterData.records.length;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold font-poppins text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-secondary" /> Rangkuman Akademik
                </h3>
                <select 
                    value={selectedSemesterId} 
                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                    className="border rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-primary w-full sm:w-auto"
                >
                    {mockSemesterData.map(semester => (
                        <option key={semester.semesterId} value={semester.semesterId}>
                            {semester.semesterName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-primary text-white p-4 rounded-lg text-center mb-4">
                <p className="text-sm uppercase tracking-wider">Rata-rata Nilai</p>
                <p className="text-4xl font-bold">{averageScore.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-3 font-semibold text-gray-500 text-sm px-3 py-2">
                    <span>Mata Pelajaran</span>
                    <span className="text-center">Guru</span>
                    <span className="text-right">Nilai</span>
                </div>
                 {selectedSemesterData.records.map((record, index) => (
                    <div key={index} className="grid grid-cols-3 items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md">
                        <p className="font-semibold text-gray-800">{record.subject}</p>
                        <p className="text-xs text-gray-500 text-center">{record.teacher}</p>
                        <p className={`text-xl font-bold text-right ${record.score >= 75 ? 'text-green-600' : 'text-red-600'}`}>{record.score}</p>
                    </div>
                 ))}
            </div>
        </div>
    );
};

const ParentDashboardPage: React.FC = () => {
    const { student } = useParentAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(null);

    const handleOpenModal = (record: AcademicRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const relevantAnnouncements = mockSchoolAnnouncements.filter(
        ann => ann.targetGrade === 'all' || ann.targetGrade === student?.grade
    );

    return (
        <div className="space-y-8">
            <StudentProfileCard />
            
            <SemesterPerformanceCard />

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="text-secondary" /> Nilai Terbaru (Semester Ini)</h3>
                    <div className="space-y-3">
                        {mockAcademicRecords.map((record, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-gray-700">{record.subject}</p>
                                    <p className="text-xs text-gray-500">Guru: {record.teacher}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`text-xl font-bold ${record.score >= 75 ? 'text-green-600' : 'text-red-600'}`}>{record.score}</p>
                                    <button onClick={() => handleOpenModal(record)} className="text-sm font-semibold text-primary hover:underline focus:outline-none">
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <AttendanceCard />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><Megaphone className="text-secondary" /> Pengumuman Sekolah</h3>
                <div className="space-y-4">
                    {relevantAnnouncements.length > 0 ? (
                        relevantAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)
                    ) : (
                        <p className="text-center text-gray-500">Tidak ada pengumuman baru.</p>
                    )}
                </div>
            </div>

            {isModalOpen && <AcademicDetailModal record={selectedRecord} onClose={handleCloseModal} />}
        </div>
    );
};

export default ParentDashboardPage;