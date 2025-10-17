'use client';

import { useState, useEffect, useMemo } from 'react';
import { Concert } from '@/types/concert';
import ConcertCard from '@/components/ConcertCard';
import CalendarView from '@/components/CalendarView';
import SearchAndFilter from '@/components/SearchAndFilter';
import StatsSection from '@/components/StatsSection';
import UpcomingHighlight from '@/components/UpcomingHighlight';
import LoadingSkeleton from '@/components/LoadingSkeleton';

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Calendrier La Belle Électrique',
                      text: 'Découvre tous les concerts de La Belle Électrique !',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Lien copié !');
                  }
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm hidden sm:block"
                title="Partager"
              >
                🔗 Partager
              </button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Content */}
        {!loading && (
          <div className="space-y-8">
            {/* Stats Section */}
            <StatsSection concerts={concerts} />

            {/* Upcoming Highlight */}
            <UpcomingHighlight concerts={concerts} />

            {/* View Toggle */}
            <div className="flex items-center gap-4">
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
            <SearchAndFilter
              onSearchChange={setSearchTerm}
              onGenreFilter={setSelectedGenre}
              onVenueFilter={setSelectedVenue}
              genres={genres}
              venues={venues}
              selectedGenre={selectedGenre}
              selectedVenue={selectedVenue}
            />

            {/* Results */}
            {filteredConcerts.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-zinc-400 text-lg mb-2">Aucun concert trouvé</p>
                <p className="text-zinc-500 text-sm">Essayez de modifier vos filtres</p>
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-white font-bold mb-2">À propos</h3>
              <p className="text-zinc-500 text-sm">
                Calendrier non officiel pour La Belle Électrique.
                Toutes les données proviennent du site officiel.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Liens utiles</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="https://www.la-belle-electrique.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                    Site officiel
                  </a>
                </li>
                <li>
                  <a href="https://billetterie.la-belle-electrique.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                    Billetterie
                  </a>
                </li>
                <li>
                  <a href="https://www.la-belle-electrique.com/fr/infos-pratiques" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                    Infos pratiques
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Technologies</h3>
              <p className="text-zinc-500 text-sm">
                Next.js • TypeScript • Tailwind CSS<br />
                Puppeteer • Vercel
              </p>
            </div>
          </div>
          <div className="text-center text-zinc-500 text-sm border-t border-zinc-800 pt-6">
            <p>Données actualisées en temps réel • Projet open-source</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
