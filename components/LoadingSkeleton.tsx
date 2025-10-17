export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-zinc-800 rounded-lg border border-zinc-700" />
        ))}
      </div>

      {/* Upcoming skeleton */}
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6">
        <div className="h-8 bg-zinc-700 rounded w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-32 bg-zinc-700 rounded" />
              <div className="h-4 bg-zinc-700 rounded w-3/4" />
              <div className="h-4 bg-zinc-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Search filters skeleton */}
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-6 space-y-4">
        <div className="h-12 bg-zinc-700 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-zinc-700 rounded" />
          <div className="h-12 bg-zinc-700 rounded" />
        </div>
      </div>

      {/* Concert cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] bg-zinc-800 rounded-lg" />
            <div className="h-6 bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-zinc-800 rounded w-16" />
              <div className="h-6 bg-zinc-800 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
