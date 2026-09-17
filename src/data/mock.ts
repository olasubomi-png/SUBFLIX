export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  backdrop?: string;
  description?: string;
  runtime?: number;
};

export type Series = {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  seasons: number;
  description?: string;
};

export type ContinueWatchingItem = {
  id: string;
  title: string;
  episode: string;
  progress: number; // 0-100
  thumbnail: string;
};

export type Genre = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export const trendingMovies: Movie[] = [
  {
    id: "1",
    title: "Neon Horizon",
    year: 2025,
    genre: "Sci-Fi",
    rating: 8.7,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    description: "In a neon-soaked future, a rogue AI hunter races against time to prevent the collapse of reality.",
  },
  {
    id: "2",
    title: "Echoes of Lagos",
    year: 2024,
    genre: "Drama",
    rating: 8.4,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    description: "A gripping family saga set against the vibrant streets of modern Lagos.",
  },
  {
    id: "3",
    title: "Shadow Protocol",
    year: 2025,
    genre: "Thriller",
    rating: 8.1,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    description: "An elite agent uncovers a conspiracy that reaches the highest levels of power.",
  },
  {
    id: "4",
    title: "Midnight Run",
    year: 2023,
    genre: "Action",
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    description: "High-octane chase across continents as a courier becomes the hunted.",
  },
  {
    id: "5",
    title: "The Last Verse",
    year: 2024,
    genre: "Romance",
    rating: 8.2,
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    description: "Two poets find love in the quiet spaces between words and silence.",
  },
  {
    id: "6",
    title: "Void Walker",
    year: 2025,
    genre: "Sci-Fi",
    rating: 8.5,
    poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=600&fit=crop",
    description: "A lone explorer drifts between dimensions searching for a lost colony.",
  },
  {
    id: "7",
    title: "Crimson Tide",
    year: 2024,
    genre: "Action",
    rating: 7.8,
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    description: "Underwater special forces battle an unseen enemy beneath the waves.",
  },
  {
    id: "8",
    title: "Quiet Storm",
    year: 2023,
    genre: "Drama",
    rating: 8.6,
    poster: "https://images.unsplash.com/photo-1509347528160-9329d33b2588?w=400&h=600&fit=crop",
    description: "A young musician confronts her past while chasing a dream in the big city.",
  },
];

export const popularMovies: Movie[] = [
  {
    id: "9",
    title: "Iron Legacy",
    year: 2024,
    genre: "Action",
    rating: 8.0,
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop",
  },
  {
    id: "10",
    title: "Starlight",
    year: 2025,
    genre: "Sci-Fi",
    rating: 8.3,
    poster: "https://images.unsplash.com/photo-1535016120720-bc917b8561b5?w=400&h=600&fit=crop",
  },
  {
    id: "11",
    title: "The Healer",
    year: 2023,
    genre: "Drama",
    rating: 7.7,
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
  },
  {
    id: "12",
    title: "Blackout",
    year: 2024,
    genre: "Thriller",
    rating: 8.1,
    poster: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&h=600&fit=crop",
  },
  {
    id: "13",
    title: "Golden Hour",
    year: 2025,
    genre: "Romance",
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
  },
  {
    id: "14",
    title: "Pixel Wars",
    year: 2024,
    genre: "Animation",
    rating: 8.4,
    poster: "https://images.unsplash.com/photo-1611162617474-5b21e764ac8f?w=400&h=600&fit=crop",
  },
];

export const popularSeries: Series[] = [
  {
    id: "s1",
    title: "City of Lights",
    year: 2024,
    genre: "Drama",
    rating: 8.8,
    poster: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=600&fit=crop",
    seasons: 3,
  },
  {
    id: "s2",
    title: "The Network",
    year: 2025,
    genre: "Thriller",
    rating: 8.5,
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop",
    seasons: 2,
  },
  {
    id: "s3",
    title: "Beyond the Veil",
    year: 2023,
    genre: "Sci-Fi",
    rating: 8.2,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    seasons: 4,
  },
  {
    id: "s4",
    title: "Family Business",
    year: 2024,
    genre: "Comedy",
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    seasons: 2,
  },
  {
    id: "s5",
    title: "Silent Code",
    year: 2025,
    genre: "Action",
    rating: 8.1,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    seasons: 1,
  },
  {
    id: "s6",
    title: "Heartlines",
    year: 2023,
    genre: "Romance",
    rating: 8.0,
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    seasons: 3,
  },
];

export const continueWatching: ContinueWatchingItem[] = [
  {
    id: "cw1",
    title: "City of Lights",
    episode: "S2 E4 — The Offer",
    progress: 67,
    thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=340&fit=crop",
  },
  {
    id: "cw2",
    title: "Neon Horizon",
    episode: "Full Movie",
    progress: 34,
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=340&fit=crop",
  },
  {
    id: "cw3",
    title: "The Network",
    episode: "S1 E7 — Firewall",
    progress: 89,
    thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&h=340&fit=crop",
  },
];

export const genres: Genre[] = [
  { id: "g1", name: "Action", slug: "action", color: "from-red-600/80 to-orange-600/60" },
  { id: "g2", name: "Comedy", slug: "comedy", color: "from-yellow-500/80 to-amber-600/60" },
  { id: "g3", name: "Drama", slug: "drama", color: "from-blue-600/80 to-indigo-700/60" },
  { id: "g4", name: "Thriller", slug: "thriller", color: "from-slate-600/80 to-gray-800/60" },
  { id: "g5", name: "Romance", slug: "romance", color: "from-pink-500/80 to-rose-600/60" },
  { id: "g6", name: "Sci-Fi", slug: "sci-fi", color: "from-violet-600/80 to-purple-800/60" },
  { id: "g7", name: "Animation", slug: "animation", color: "from-cyan-500/80 to-teal-600/60" },
  { id: "g8", name: "Documentary", slug: "documentary", color: "from-emerald-600/80 to-green-800/60" },
];
