import React, { useState, useEffect, useMemo } from 'react';
import { SchoolEvent } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Calendar, Clock, MapPin, Tag, LoaderCircle } from 'lucide-react';

const EventCard: React.FC<{ event: SchoolEvent }> = ({ event }) => {
    const eventDate = new Date(event.date + 'T00:00:00');
    const day = eventDate.toLocaleDateString('id-ID', { day: '2-digit' });
    const month = eventDate.toLocaleDateString('id-ID', { month: 'short' });

    const categoryColors: { [key: string]: string } = {
        'Akademik': 'bg-blue-100 text-blue-800',
        'Olahraga': 'bg-green-100 text-green-800',
        'Seni & Budaya': 'bg-purple-100 text-purple-800',
        'Umum': 'bg-yellow-100 text-yellow-800',
        'Hari Libur Nasional': 'bg-red-100 text-red-800',
    };

    return (
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0 text-center bg-primary text-white rounded-lg p-2 w-20">
                <p className="text-3xl font-bold">{day}</p>
                <p className="text-sm font-semibold">{month.toUpperCase()}</p>
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold font-poppins text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {event.time}</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-1" /> {event.location}</span>
                </div>
                <div className="mt-2">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
                        {event.category}
                    </span>
                </div>
            </div>
        </div>
    );
};


const EventCalendarPage: React.FC = () => {
    const [events, setEvents] = useState<SchoolEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            const eventsCollectionRef = collection(db, "events");
            const q = query(eventsCollectionRef, orderBy("date", "asc"));
            const data = await getDocs(q);
            const eventsData = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as SchoolEvent));
            setEvents(eventsData);
            setIsLoading(false);
        };
        fetchEvents();
    }, []);

    const groupedEvents = useMemo(() => {
        const groups: { [key: string]: SchoolEvent[] } = {};
        events.forEach(event => {
            const monthYear = new Date(event.date + 'T00:00:00').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(event);
        });
        return groups;
    }, [events]);

    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Calendar size={36} />
                    Kalender Kegiatan Sekolah
                </h1>
                
                 {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoaderCircle className="animate-spin text-primary" size={40} />
                    </div>
                ) : Object.keys(groupedEvents).length > 0 ? (
                     <div className="space-y-10">
                        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
                            <div key={monthYear}>
                                <h2 className="text-2xl font-bold font-poppins text-gray-700 mb-4 border-b-2 border-primary pb-2">{monthYear}</h2>
                                <div className="space-y-4">
                                    {monthEvents.map(event => <EventCard key={event.id} event={event} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-8">Tidak ada kegiatan yang dijadwalkan.</p>
                )}
            </div>
        </div>
    );
};

export default EventCalendarPage;
