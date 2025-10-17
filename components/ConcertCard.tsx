'use client';

import { Concert } from '@/types/concert';
import Image from 'next/image';
import { useFavorites } from '@/contexts/FavoritesContext';
import { generateICS, downloadICS } from '@/lib/icsGenerator';
import { getStreamingLinks, streamingPlatforms } from '@/lib/streamingLinks';
import { useState } from 'react';

interface ConcertCardProps {
  concert: Concert;
}

export default function ConcertCard({ concert }: ConcertCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showStreamingLinks, setShowStreamingLinks] = useState(false);
  const favorite = isFavorite(concert.id);

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

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const icsContent = generateICS(concert);
    const filename = `${concert.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    downloadICS(icsContent, filename);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(concert.id);
  };

  const handleToggleStreaming = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowStreamingLinks(!showStreamingLinks);
  };

  const streamingLinks = getStreamingLinks(concert.title);

  return (
    <div className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-700/50">
      {/* Main concert link */}
      <a
        href={concert.eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
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

            {/* Favorite button - top left */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all ${
                favorite
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <svg className="w-5 h-5" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
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

      {/* Action buttons */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleAddToCalendar}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
            title="Ajouter à mon calendrier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendrier
          </button>
          <button
            onClick={handleToggleStreaming}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
            title="Découvrir l'artiste"
          >
            <span>🎵</span>
            Écouter
          </button>
        </div>

        {/* Streaming links dropdown */}
        {showStreamingLinks && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            {streamingPlatforms.map(platform => (
              <a
                key={platform.key}
                href={streamingLinks[platform.key]}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded text-sm text-zinc-300 transition-all ${platform.bgColor} ${platform.color} border border-zinc-700 hover:border-zinc-600`}
                title={`Écouter sur ${platform.name}`}
              >
                <span className="text-base">{platform.icon}</span>
                <span className="text-xs">{platform.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
