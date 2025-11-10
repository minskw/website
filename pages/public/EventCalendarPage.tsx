

import React, { useState, useMemo } from 'react';
import { mockEvents } from '../../services/mockApi';
import { SchoolEvent } from '../../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventCard: React.FC<{ event: SchoolEvent }> = ({ event }) => {
    const eventDate = new Date(`${event.date}T00:00:00`);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('id-ID', { month: 'short' });

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-start space-x-4 p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex-shrink-0 text-center bg-primary text-white rounded-md p-3 w-20">
                <p className="text-3xl font-bold">{day}</p>
                <p className="text-sm font-semibold uppercase">{month}</p>
            </div>
            <div className="flex-grow">
                <span className="text-xs font-semibold text-secondary bg-yellow-100 px-2 py-1 rounded-full">{event.category}</span>
                <h3 className="mt-1 text-lg font-bold font-poppins text-gray-800">{event.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{event.time} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventCalendarPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const categories = useMemo(() => Array.from(new Set(mockEvents.map(event => event.category))), []);

    // Group events by month
    const groupedEvents = useMemo(() => {
        const filteredEvents = mockEvents.filter(event =>
            selectedCategory === 'Semua' || event.category === selectedCategory
        );

        return filteredEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            // FIX: Explicitly cast the initial value of `reduce` to ensure TypeScript correctly infers the accumulator's type.
            .reduce((acc, event) => {
                const eventDate = new Date(`${event.date}T00:00:00`);
                const month = eventDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
                if (!acc[month]) {
                    acc[month] = [];
                }
                acc[month].push(event);
                return acc;
            }, {} as Record<string, SchoolEvent[]>);
    }, [selectedCategory]);


    return (
        <div className="bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold font-poppins text-center text-primary mb-6">
                    <Calendar className="inline-block mr-3 mb-2" size={36}/>
                    Kalender Kegiatan Sekolah
                </h1>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <button
                        onClick={() => setSelectedCategory('Semua')}
                        className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm transition-colors ${
                            selectedCategory === 'Semua'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm transition-colors ${
                                selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>


                {Object.keys(groupedEvents).length > 0 ? (
                    <div className="space-y-12 max-w-4xl mx-auto">
                        {Object.entries(groupedEvents).map(([month, events]) => (
                            <div key={month}>
                                <h2 className="text-2xl font-bold font-poppins text-gray-700 mb-6 border-b-2 border-primary pb-2">{month}</h2>
                                <div className="space-y-6">
                                    {events.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-8">
                        Tidak ada kegiatan yang ditemukan untuk kategori yang dipilih.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventCalendarPage;