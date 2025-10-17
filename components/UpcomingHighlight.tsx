'use client';

import { Concert } from '@/types/concert';
import { useMemo } from 'react';
import Image from 'next/image';

interface UpcomingHighlightProps {
  concerts: Concert[];
}

export default function UpcomingHighlight({ concerts }: UpcomingHighlightProps) {
  const nextConcerts = useMemo(() => {
    const now = new Date();

    const parseConcertDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.').map(Number);
      return new Date(2000 + year, month - 1, day);
    };

    return concerts
      .filter(c => parseConcertDate(c.date) >= now)
      .slice(0, 3);
  }, [concerts]);

  if (nextConcerts.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg border border-zinc-700 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span>⭐</span>
        Prochains concerts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nextConcerts.map((concert, index) => (
          <a
            key={concert.id}
            href={concert.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-all"
          >
            {concert.imageUrl && (
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={concert.imageUrl}
                  alt={concert.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {concert.isSoldOut && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                    COMPLET
                  </div>
                )}
              </div>
            )}
            <div className="p-3">
              <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-zinc-300 transition-colors">
                {concert.title}
              </h3>
              <p className="text-sm text-zinc-400 mb-2">{formatDate(concert.date)}</p>
              <div className="flex flex-wrap gap-1">
                {concert.time && (
                  <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                    {concert.time}
                  </span>
                )}
                {concert.genre && (
                  <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                    {concert.genre}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
