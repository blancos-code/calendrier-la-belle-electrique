'use client';

import { useState, useEffect, useMemo } from 'react';
import { Concert } from '@/types/concert';
import ConcertCard from '@/components/ConcertCard';
import CalendarView from '@/components/CalendarView';
import SearchAndFilter from '@/components/SearchAndFilter';

export default function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');

  useEffect(() => {
    async function fetchConcerts() {
      try {
        const response = await fetch('/api/concerts');
        const data = await response.json();
        setConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConcerts();
  }, []);

  // Extract unique genres and venues
  const genres = useMemo(() => {
    const uniqueGenres = new Set(concerts.map(c => c.genre).filter(Boolean));
    return Array.from(uniqueGenres).sort();
  }, [concerts]);

  const venues = useMemo(() => {
    const uniqueVenues = new Set(concerts.map(c => c.venue).filter(Boolean));
    return Array.from(uniqueVenues).sort();
  }, [concerts]);

  // Filter concerts
  const filteredConcerts = useMemo(() => {
    return concerts.filter(concert => {
      const matchesSearch = !searchTerm ||
        concert.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre = !selectedGenre || concert.genre === selectedGenre;
      const matchesVenue = !selectedVenue || concert.venue === selectedVenue;

      return matchesSearch && matchesGenre && matchesVenue;
    });
  }, [concerts, searchTerm, selectedGenre, selectedVenue]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Calendrier La Belle Électrique
              </h1>
              <p className="text-zinc-400">
                Tous les concerts et événements à venir
              </p>
            </div>
            <a
              href="https://www.la-belle-electrique.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
            >
              Site officiel →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            Grille
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            Calendrier
          </button>
          <div className="ml-auto text-zinc-400">
            {filteredConcerts.length} événement{filteredConcerts.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilter
            onSearchChange={setSearchTerm}
            onGenreFilter={setSelectedGenre}
            onVenueFilter={setSelectedVenue}
            genres={genres}
            venues={venues}
            selectedGenre={selectedGenre}
            selectedVenue={selectedVenue}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
            <p className="mt-4 text-zinc-400">Chargement des concerts...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {filteredConcerts.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-zinc-400 text-lg">Aucun concert trouvé</p>
              </div>
            ) : viewMode === 'calendar' ? (
              <CalendarView concerts={filteredConcerts} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConcerts.map(concert => (
                  <ConcertCard key={concert.id} concert={concert} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-500 text-sm">
          <p>
            Données scrapées depuis{' '}
            <a
              href="https://www.la-belle-electrique.com/fr/programmation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              la-belle-electrique.com
            </a>
          </p>
          <p className="mt-2">Projet non officiel - Mis à jour toutes les heures</p>
        </div>
      </footer>
    </div>
  );
}
