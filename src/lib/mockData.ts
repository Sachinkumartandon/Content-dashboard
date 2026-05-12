// ============================================================
//   src/lib/mockData.ts
//   Fake data used when:
//   1. Real API key is missing
//   2. API rate limit is hit
//   3. Running tests
//   Import: import { mockNews, mockMovies, mockSocialPosts } from '@/lib/mockData'
// ============================================================

import type { NewsArticle, Movie, SocialPost } from '@/types'
import { generateId } from '@/lib/utils'


// ─── Mock News Articles ───────────────────────────────────────────────────────

export const mockNews: NewsArticle[] = [
  {
    id:          generateId('news'),
    type:        'news',
    title:       'Apple Unveils New AI Features Coming to iPhone This Year',
    description: 'Apple announced a suite of artificial intelligence features that will be integrated into iOS, focusing on privacy-first on-device processing.',
    content:     'Apple announced a suite of artificial intelligence features that will be integrated into iOS, focusing on privacy-first on-device processing. The features include smart replies, photo editing tools, and a redesigned Siri.',
    url:         'https://example.com/apple-ai',
    imageUrl:    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    source:      'TechCrunch',
    author:      'Sarah Johnson',
    category:    'technology',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    isFavorite:  false,
  },
  {
    id:          generateId('news'),
    type:        'news',
    title:       'Global Stock Markets Rally as Inflation Data Shows Improvement',
    description: 'Major stock indices surged today after new inflation data came in lower than expected, boosting investor confidence across global markets.',
    content:     'Major stock indices surged today after new inflation data came in lower than expected, boosting investor confidence across global markets.',
    url:         'https://example.com/stock-market',
    imageUrl:    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    source:      'Bloomberg',
    author:      'Michael Chen',
    category:    'finance',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isFavorite:  false,
  },
  {
    id:          generateId('news'),
    type:        'news',
    title:       'Scientists Discover New Species of Deep Sea Creature',
    description: 'Marine biologists exploring the Pacific Ocean have discovered a previously unknown species of bioluminescent jellyfish at a depth of 3,000 meters.',
    content:     'Marine biologists exploring the Pacific Ocean have discovered a previously unknown species of bioluminescent jellyfish at a depth of 3,000 meters.',
    url:         'https://example.com/deep-sea',
    imageUrl:    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400',
    source:      'National Geographic',
    author:      'Emma Williams',
    category:    'science',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isFavorite:  false,
  },
  {
    id:          generateId('news'),
    type:        'news',
    title:       'Premier League: Manchester City Wins in Dramatic Fashion',
    description: 'Manchester City secured a late victory with a 93rd-minute goal, keeping their title hopes alive with just four games remaining in the season.',
    content:     'Manchester City secured a late victory with a 93rd-minute goal, keeping their title hopes alive with just four games remaining in the season.',
    url:         'https://example.com/man-city',
    imageUrl:    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
    source:      'ESPN',
    author:      'James Wilson',
    category:    'sports',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isFavorite:  false,
  },
  {
    id:          generateId('news'),
    type:        'news',
    title:       'New Study Reveals Benefits of Mediterranean Diet on Heart Health',
    description: 'A comprehensive 10-year study involving over 50,000 participants confirms that following a Mediterranean diet significantly reduces the risk of cardiovascular disease.',
    content:     'A comprehensive 10-year study involving over 50,000 participants confirms that following a Mediterranean diet significantly reduces the risk of cardiovascular disease.',
    url:         'https://example.com/diet-study',
    imageUrl:    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    source:      'Health Today',
    author:      'Dr. Lisa Park',
    category:    'health',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isFavorite:  false,
  },
  {
    id:          generateId('news'),
    type:        'news',
    title:       'Tesla Announces Next Generation Electric Vehicle Platform',
    description: 'Tesla revealed plans for a revolutionary new EV platform that promises to cut manufacturing costs by 50% while doubling the range of current models.',
    content:     'Tesla revealed plans for a revolutionary new EV platform that promises to cut manufacturing costs by 50% while doubling the range of current models.',
    url:         'https://example.com/tesla-ev',
    imageUrl:    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    source:      'The Verge',
    author:      'Alex Rodriguez',
    category:    'technology',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    isFavorite:  false,
  },
]


// ─── Mock Movies ──────────────────────────────────────────────────────────────

export const mockMovies: Movie[] = [
  {
    id:          'movie_1',
    type:        'movie',
    title:       'Dune: Part Three',
    description: 'The epic conclusion to the Dune saga follows Paul Atreides as he leads the Fremen in a final battle against the forces of the Imperium.',
    imageUrl:    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    rating:      8.7,
    releaseDate: '2024-11-22',
    genres:      ['Science Fiction', 'Adventure', 'Drama'],
    voteCount:   12500,
    popularity:  98.4,
    isFavorite:  false,
  },
  {
    id:          'movie_2',
    type:        'movie',
    title:       'The Grand Budapest Hotel 2',
    description: 'Wes Anderson returns to the iconic hotel with a new concierge, a missing painting, and a mystery that spans three decades.',
    imageUrl:    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    rating:      8.2,
    releaseDate: '2024-09-15',
    genres:      ['Comedy', 'Drama', 'Mystery'],
    voteCount:   8900,
    popularity:  76.3,
    isFavorite:  false,
  },
  {
    id:          'movie_3',
    type:        'movie',
    title:       'Interstellar: Origins',
    description: 'A prequel exploring the early days of NASA\'s secret space program and the scientists who made the impossible mission possible.',
    imageUrl:    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    rating:      7.9,
    releaseDate: '2024-07-04',
    genres:      ['Science Fiction', 'Thriller'],
    voteCount:   6700,
    popularity:  65.8,
    isFavorite:  false,
  },
  {
    id:          'movie_4',
    type:        'movie',
    title:       'Tokyo Drift',
    description: 'A young street racer relocates to Tokyo where he discovers a new world of drift racing and becomes entangled in the criminal underworld.',
    imageUrl:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating:      7.4,
    releaseDate: '2024-06-21',
    genres:      ['Action', 'Thriller'],
    voteCount:   5400,
    popularity:  58.2,
    isFavorite:  false,
  },
  {
    id:          'movie_5',
    type:        'movie',
    title:       'The Last Forest',
    description: 'An environmental activist and a logging company heir must work together to save the last ancient forest from corporate destruction.',
    imageUrl:    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
    rating:      7.6,
    releaseDate: '2024-05-10',
    genres:      ['Drama', 'Adventure'],
    voteCount:   4200,
    popularity:  45.1,
    isFavorite:  false,
  },
  {
    id:          'movie_6',
    type:        'movie',
    title:       'Midnight in Paris: Redux',
    description: 'A modern-day writer discovers a mysterious portal that transports him to the golden age of Parisian art and literature.',
    imageUrl:    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    rating:      8.1,
    releaseDate: '2024-04-14',
    genres:      ['Romance', 'Fantasy', 'Comedy'],
    voteCount:   7800,
    popularity:  72.5,
    isFavorite:  false,
  },
]


// ─── Mock Social Posts ────────────────────────────────────────────────────────

export const mockSocialPosts: SocialPost[] = [
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Just launched my new open-source project! A React component library with 50+ accessible components. Check it out and give it a ⭐ #ReactJS #OpenSource #WebDev',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    author: {
      name:      'Dan Abramov',
      username:  'dan_abramov',
      avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
    },
    hashtags:    ['ReactJS', 'OpenSource', 'WebDev'],
    likes:       4821,
    comments:    312,
    shares:      891,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Golden hour never disappoints 🌅 Shot this on my morning run today. Nature is the best therapy. #Photography #GoldenHour #Nature #Morning',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    author: {
      name:      'Priya Sharma',
      username:  'priya.captures',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40',
    },
    hashtags:    ['Photography', 'GoldenHour', 'Nature'],
    likes:       9234,
    comments:    187,
    shares:      432,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Hot take: TypeScript has completely changed how I write code. The time you spend on types upfront saves 10x in debugging later. Who agrees? #TypeScript #Programming #DevLife',
    imageUrl: null,
    author: {
      name:      'Sachin Developer',
      username:  'sachin_codes',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    },
    hashtags:    ['TypeScript', 'Programming', 'DevLife'],
    likes:       2156,
    comments:    445,
    shares:      678,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Exploring the streets of Tokyo 🗼 Every corner tells a story. The blend of ancient traditions and ultra-modern technology is just breathtaking. #Tokyo #Travel #Japan',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    author: {
      name:      'Travel with Raj',
      username:  'raj.travels',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40',
    },
    hashtags:    ['Tokyo', 'Travel', 'Japan'],
    likes:       15670,
    comments:    892,
    shares:      2341,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Just finished reading "Atomic Habits" for the third time. Every read reveals something new. Small habits really do compound into massive results. Highly recommend 📚 #Books #SelfImprovement',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    author: {
      name:      'Ananya Reads',
      username:  'ananya.reads',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40',
    },
    hashtags:    ['Books', 'SelfImprovement', 'Reading'],
    likes:       3890,
    comments:    234,
    shares:      567,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'The future of AI is not about replacing humans — it\'s about augmenting human creativity and productivity. We are entering the most exciting era in human history. #AI #Future #Technology',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400',
    author: {
      name:      'Tech Insights',
      username:  'tech.insights',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
    },
    hashtags:    ['AI', 'Future', 'Technology'],
    likes:       7823,
    comments:    621,
    shares:      1456,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isFavorite:  false,
  },
]


// ─── Combined Mock Feed ───────────────────────────────────────────────────────
// Interleaves all content types into one unified feed

export const mockFeedItems = [
  mockNews[0],
  mockMovies[0],
  mockSocialPosts[0],
  mockNews[1],
  mockMovies[1],
  mockSocialPosts[1],
  mockNews[2],
  mockMovies[2],
  mockSocialPosts[2],
  mockNews[3],
  mockMovies[3],
  mockSocialPosts[3],
  mockNews[4],
  mockMovies[4],
  mockSocialPosts[4],
  mockNews[5],
  mockMovies[5],
  mockSocialPosts[5],
]

// ─── Mock Trending Items ──────────────────────────────────────────────────────

export const mockTrending = {
  news:   mockNews.slice(0, 3),
  movies: mockMovies.slice(0, 3),
  social: mockSocialPosts.slice(0, 3),
}