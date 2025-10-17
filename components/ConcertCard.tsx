'use client';

import { Concert } from '@/types/concert';
import Image from 'next/image';

interface ConcertCardProps {
  concert: Concert;
}

export default function ConcertCard({ concert }: ConcertCardProps) {
  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <a
      href={concert.eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-700/50"
    >
      {concert.imageUrl && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
          <Image
            src={concert.imageUrl}
            alt={concert.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {concert.isSoldOut && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
              COMPLET
            </div>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors">
          {concert.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(concert.date)}</span>
          {concert.time && (
            <>
              <span>•</span>
              <span>{concert.time}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {concert.genre && (
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
              {concert.genre}
            </span>
          )}
          {concert.venue && (
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
              {concert.venue}
            </span>
          )}
          {concert.eventType && concert.eventType !== 'Concert' && (
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
              {concert.eventType}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
