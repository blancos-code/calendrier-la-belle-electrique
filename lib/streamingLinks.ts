export interface StreamingLinks {
  spotify: string;
  youtube: string;
  deezer: string;
  appleMusic: string;
}

export function getStreamingLinks(artistName: string): StreamingLinks {
  // Clean artist name (remove "+" and extra info)
  const cleanName = artistName.split('+')[0].trim();
  const encodedName = encodeURIComponent(cleanName);

  return {
    spotify: `https://open.spotify.com/search/${encodedName}`,
    youtube: `https://music.youtube.com/search?q=${encodedName}`,
    deezer: `https://www.deezer.com/search/${encodedName}`,
    appleMusic: `https://music.apple.com/search?term=${encodedName}`,
  };
}

export const streamingPlatforms = [
  {
    name: 'Spotify',
    key: 'spotify' as const,
    icon: '🎵',
    color: 'hover:text-green-500',
    bgColor: 'hover:bg-green-500/10',
  },
  {
    name: 'YouTube Music',
    key: 'youtube' as const,
    icon: '🎥',
    color: 'hover:text-red-500',
    bgColor: 'hover:bg-red-500/10',
  },
  {
    name: 'Deezer',
    key: 'deezer' as const,
    icon: '🎧',
    color: 'hover:text-orange-500',
    bgColor: 'hover:bg-orange-500/10',
  },
  {
    name: 'Apple Music',
    key: 'appleMusic' as const,
    icon: '🍎',
    color: 'hover:text-pink-500',
    bgColor: 'hover:bg-pink-500/10',
  },
];
