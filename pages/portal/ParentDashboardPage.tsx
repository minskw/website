import React from 'react';
import { useParentAuth } from '../../hooks/useParentAuth';
import { mockAcademicRecords, mockAttendanceRecords, mockSchoolAnnouncements } from '../../services/mockApi';
import { BookOpen, CalendarCheck, Megaphone, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { SchoolAnnouncement } from '../../types';

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

const ParentDashboardPage: React.FC = () => {
    const { student } = useParentAuth();

    // Filter announcements for the student's grade or 'all'
    const relevantAnnouncements = mockSchoolAnnouncements.filter(
        ann => ann.targetGrade === 'all' || ann.targetGrade === student?.grade
    );

    return (
        <div className="space-y-8">
            <StudentProfileCard />
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Academic Records */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><BookOpen className="text-secondary" /> Laporan Akademik</h3>
                    <div className="space-y-3">
                        {mockAcademicRecords.map((record, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-semibold text-gray-700">{record.subject}</p>
                                    <p className="text-xs text-gray-500">Guru: {record.teacher}</p>
                                </div>
                                <p className={`text-xl font-bold ${record.score >= 75 ? 'text-green-600' : 'text-red-600'}`}>{record.score}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2"><CalendarCheck className="text-secondary" /> Absensi Terakhir</h3>
                    <div className="space-y-2">
                         {mockAttendanceRecords.map((record, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border-b">
                                <p className="text-gray-700">{record.date}</p>
                                <div className="flex items-center gap-2">
                                    {getAttendanceIcon(record.status)}
                                    <span className="font-semibold text-gray-600">{record.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Announcements */}
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
        </div>
    );
};

export default ParentDashboardPage;
