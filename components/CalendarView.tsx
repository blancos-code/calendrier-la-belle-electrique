'use client';

import { Concert } from '@/types/concert';
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarViewProps {
  concerts: Concert[];
}

export default function CalendarView({ concerts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-zinc-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
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
                        <a
                          key={concert.id}
                          href={concert.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded truncate text-white transition-colors"
                          title={`${concert.title} - ${concert.time}\n${concert.genre ? concert.genre + ' • ' : ''}${concert.venue}\nCliquez pour voir les détails`}
                        >
                          {concert.title}
                        </a>
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
    </div>
  );
}
