'use client';

import { useState } from 'react';

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void;
  onGenreFilter: (genre: string) => void;
  onVenueFilter: (venue: string) => void;
  genres: string[];
  venues: string[];
  selectedGenre: string;
  selectedVenue: string;
}

export default function SearchAndFilter({
  onSearchChange,
  onGenreFilter,
  onVenueFilter,
  genres,
  venues,
  selectedGenre,
  selectedVenue,
}: SearchAndFilterProps) {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 space-y-4">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-zinc-400 mb-2">
          Rechercher un concert
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Nom de l'artiste..."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-3.5 w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Genre Filter */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-zinc-400 mb-2">
            Genre musical
          </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => onGenreFilter(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent cursor-pointer"
          >
            <option value="">Tous les genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Venue Filter */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-zinc-400 mb-2">
            Salle
          </label>
          <select
            id="venue"
            value={selectedVenue}
            onChange={(e) => onVenueFilter(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent cursor-pointer"
          >
            <option value="">Toutes les salles</option>
            {venues.map(venue => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      {(search || selectedGenre || selectedVenue) && (
        <button
          onClick={() => {
            setSearch('');
            onSearchChange('');
            onGenreFilter('');
            onVenueFilter('');
          }}
          className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
