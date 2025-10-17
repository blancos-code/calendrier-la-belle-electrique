'use client';

import { Concert } from '@/types/concert';
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

interface CalendarViewProps {
  concerts: Concert[];
}

export default function CalendarView({ concerts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDayConcerts, setSelectedDayConcerts] = useState<Concert[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Parse concert dates
  const parseConcertDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(2000 + year, month - 1, day);
  };

  // Group concerts by date
  const concertsByDate = useMemo(() => {
    const grouped: { [key: string]: Concert[] } = {};

    concerts.forEach(concert => {
      const date = parseConcertDate(concert.date);
      const key = format(date, 'yyyy-MM-dd');

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(concert);
    });

    return grouped;
  }, [concerts]);

  const getConcertsForDay = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    return concertsByDate[key] || [];
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const openDayModal = (day: Date, concerts: Concert[]) => {
    setSelectedDay(day);
    setSelectedDayConcerts(concerts);
  };

  const closeDayModal = () => {
    setSelectedDay(null);
    setSelectedDayConcerts([]);
  };

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-3 md:p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="px-3 md:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextMonth}
              className="px-3 md:px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Weekday Headers - Desktop */}
        <div className="hidden md:grid grid-cols-7 gap-2 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-zinc-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Weekday Headers - Mobile */}
        <div className="grid md:hidden grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-center text-xs font-semibold text-zinc-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Desktop */}
        <div className="hidden md:grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map(day => {
            const dayConcerts = getConcertsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => dayConcerts.length > 0 && openDayModal(day, dayConcerts)}
                className={`
                  aspect-square p-2 rounded-lg border
                  ${isToday ? 'border-zinc-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900'}
                  ${dayConcerts.length > 0 ? 'hover:border-zinc-600 cursor-pointer' : ''}
                `}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-white' : 'text-zinc-400'}`}>
                    {format(day, 'd')}
                  </div>
                  {dayConcerts.length > 0 && (
                    <div className="flex-1 overflow-hidden">
                      <div className="space-y-1">
                        {dayConcerts.slice(0, 2).map(concert => (
                          <div
                            key={concert.id}
                            className="text-xs bg-zinc-700 px-2 py-1 rounded truncate text-white"
                            title={concert.title}
                          >
                            {concert.title}
                          </div>
                        ))}
                        {dayConcerts.length > 2 && (
                          <div className="text-xs text-zinc-400 px-2">
                            +{dayConcerts.length - 2} autre{dayConcerts.length > 3 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Grid - Mobile (Compact) */}
        <div className="grid md:hidden grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map(day => {
            const dayConcerts = getConcertsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => dayConcerts.length > 0 && openDayModal(day, dayConcerts)}
                className={`
                  aspect-square p-1 rounded border relative
                  ${isToday ? 'border-zinc-500 bg-zinc-800' : 'border-zinc-800 bg-zinc-900'}
                  ${dayConcerts.length > 0 ? 'cursor-pointer' : ''}
                `}
              >
                <div className="text-[10px] font-semibold text-zinc-400 text-center">
                  {format(day, 'd')}
                </div>
                {dayConcerts.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-b" />
                )}
                {dayConcerts.length > 1 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full text-[6px] flex items-center justify-center text-white font-bold">
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for day's concerts */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeDayModal}
        >
          <div
            className="bg-zinc-900 rounded-lg border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white capitalize">
                {format(selectedDay, 'EEEE d MMMM yyyy', { locale: fr })}
              </h3>
              <button
                onClick={closeDayModal}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {selectedDayConcerts.map(concert => (
                <a
                  key={concert.id}
                  href={concert.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-zinc-800 hover:bg-zinc-750 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-all">
                    <div className="flex gap-4">
                      {concert.imageUrl && (
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src={concert.imageUrl}
                            alt={concert.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 min-w-0">
                        <h4 className="font-bold text-white text-lg mb-2 group-hover:text-zinc-300 transition-colors">
                          {concert.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                          {concert.time && (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{concert.time}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {concert.genre && (
                            <span className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded">
                              {concert.genre}
                            </span>
                          )}
                          {concert.venue && (
                            <span className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded">
                              {concert.venue}
                            </span>
                          )}
                          {concert.isSoldOut && (
                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">
                              COMPLET
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
