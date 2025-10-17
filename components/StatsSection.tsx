'use client';

import { Concert } from '@/types/concert';
import { useMemo } from 'react';

interface StatsSectionProps {
  concerts: Concert[];
}

export default function StatsSection({ concerts }: StatsSectionProps) {
  const stats = useMemo(() => {
    const now = new Date();

    // Parse concert date
    const parseConcertDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('.').map(Number);
      return new Date(2000 + year, month - 1, day);
    };

    // Upcoming concerts (future)
    const upcoming = concerts.filter(c => parseConcertDate(c.date) >= now);

    // This month
    const thisMonth = concerts.filter(c => {
      const concertDate = parseConcertDate(c.date);
      return concertDate.getMonth() === now.getMonth() &&
             concertDate.getFullYear() === now.getFullYear();
    });

    // Next 7 days
    const next7Days = concerts.filter(c => {
      const concertDate = parseConcertDate(c.date);
      const diffTime = concertDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    // Sold out
    const soldOut = concerts.filter(c => c.isSoldOut).length;

    // Most popular venue
    const venueCount: { [key: string]: number } = {};
    concerts.forEach(c => {
      if (c.venue) {
        venueCount[c.venue] = (venueCount[c.venue] || 0) + 1;
      }
    });
    const popularVenue = Object.entries(venueCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Most popular genre
    const genreCount: { [key: string]: number } = {};
    concerts.forEach(c => {
      if (c.genre) {
        genreCount[c.genre] = (genreCount[c.genre] || 0) + 1;
      }
    });
    const popularGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      total: concerts.length,
      upcoming: upcoming.length,
      thisMonth: thisMonth.length,
      next7Days: next7Days.length,
      soldOut,
      popularVenue,
      popularGenre,
    };
  }, [concerts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Concerts à venir"
        value={stats.upcoming}
        icon="📅"
        color="bg-blue-500/10 border-blue-500/20"
      />
      <StatCard
        label="Cette semaine"
        value={stats.next7Days}
        icon="🔥"
        color="bg-orange-500/10 border-orange-500/20"
      />
      <StatCard
        label="Ce mois-ci"
        value={stats.thisMonth}
        icon="📆"
        color="bg-purple-500/10 border-purple-500/20"
      />
      <StatCard
        label="Complets"
        value={stats.soldOut}
        icon="🎫"
        color="bg-red-500/10 border-red-500/20"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`${color} border rounded-lg p-4 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}
