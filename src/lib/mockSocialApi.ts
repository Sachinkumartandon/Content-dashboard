// ============================================================
//   src/lib/mockSocialApi.ts
//   Mock Social Media API — simulates Twitter/Instagram
//   Assignment explicitly allows mock API for social media
//   since real Twitter/Instagram APIs are paid/restricted
// ============================================================

import type { SocialPost } from '@/types'
import { mockSocialPosts }  from '@/lib/mockData'
import { generateId }       from '@/lib/utils'


// ─── Extra Mock Posts Pool ────────────────────────────────────────────────────
// Large pool so pagination feels realistic

const EXTRA_POSTS: SocialPost[] = [
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Just hit 10,000 GitHub stars on my project! 🎉 Thank you to everyone who supported and contributed. Open source is the future! #OpenSource #GitHub #Developer',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400',
    author: {
      name:      'Linus Dev',
      username:  'linus.dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    },
    hashtags:    ['OpenSource', 'GitHub', 'Developer'],
    likes:       23400,
    comments:    1200,
    shares:      4500,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'The mountains were calling and I answered 🏔️ Weekend hike to the summit was absolutely worth every step. Fresh air, stunning views, zero WiFi — pure bliss. #Hiking #Nature #Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    author: {
      name:      'Riya Adventures',
      username:  'riya.adventures',
      avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=40',
    },
    hashtags:    ['Hiking', 'Nature', 'Adventure'],
    likes:       8900,
    comments:    445,
    shares:      1230,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'CSS tip of the day: Use CSS Grid with auto-fill and minmax for responsive layouts WITHOUT media queries. Game changer for modern web dev! #CSS #WebDev #FrontEnd',
    imageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
    author: {
      name:      'CSS Tricks',
      username:  'css.tricks',
      avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40',
    },
    hashtags:    ['CSS', 'WebDev', 'FrontEnd'],
    likes:       5670,
    comments:    334,
    shares:      890,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Homemade pasta from scratch 🍝 There is something incredibly satisfying about making food completely from scratch. Recipe in bio! #Cooking #FoodPhotography #Pasta',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
    author: {
      name:      'Chef Ankit',
      username:  'chef.ankit',
      avatarUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=40',
    },
    hashtags:    ['Cooking', 'FoodPhotography', 'Pasta'],
    likes:       12300,
    comments:    678,
    shares:      2100,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Reminder: Your mental health matters more than your productivity. Take breaks. Rest is not laziness — it is part of the process. #MentalHealth #Wellness #SelfCare',
    imageUrl: null,
    author: {
      name:      'Mind & Soul',
      username:  'mind.soul',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40',
    },
    hashtags:    ['MentalHealth', 'Wellness', 'SelfCare'],
    likes:       34500,
    comments:    2100,
    shares:      8900,
    platform:    'twitter',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isFavorite:  false,
  },
  {
    id:       generateId('social'),
    type:     'social',
    content:  'Sunset from my rooftop in Mumbai 🌆 No filter needed. This city never stops amazing me. #Mumbai #Sunset #CityLife #India',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
    author: {
      name:      'Mumbai Diaries',
      username:  'mumbai.diaries',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40',
    },
    hashtags:    ['Mumbai', 'Sunset', 'CityLife', 'India'],
    likes:       18900,
    comments:    934,
    shares:      3400,
    platform:    'instagram',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    isFavorite:  false,
  },
]

// Full pool of all mock social posts
const ALL_POSTS: SocialPost[] = [...mockSocialPosts, ...EXTRA_POSTS]


// ─── Fetch Social Posts ───────────────────────────────────────────────────────

export async function fetchSocialPosts(
  page: number = 1,
  pageSize: number = 6
): Promise<SocialPost[]> {

  // Simulate network delay (makes it feel like a real API)
  await simulateDelay(300)

  const start = (page - 1) * pageSize
  const end   = start + pageSize

  return ALL_POSTS.slice(start, end)
}


// ─── Fetch Posts by Hashtag ───────────────────────────────────────────────────

export async function fetchPostsByHashtag(
  hashtag: string,
  page: number = 1,
  pageSize: number = 6
): Promise<SocialPost[]> {

  await simulateDelay(200)

  const tag      = hashtag.replace('#', '').toLowerCase()
  const filtered = ALL_POSTS.filter(post =>
    post.hashtags.some(h => h.toLowerCase() === tag) ||
    post.content.toLowerCase().includes(tag)
  )

  const start = (page - 1) * pageSize
  const end   = start + pageSize

  return filtered.slice(start, end)
}


// ─── Search Social Posts ──────────────────────────────────────────────────────

export async function searchSocialPosts(
  query: string
): Promise<SocialPost[]> {

  if (!query.trim()) return []

  await simulateDelay(150)

  const q = query.toLowerCase()

  return ALL_POSTS.filter(post =>
    post.content.toLowerCase().includes(q) ||
    post.author.name.toLowerCase().includes(q) ||
    post.author.username.toLowerCase().includes(q) ||
    post.hashtags.some(h => h.toLowerCase().includes(q))
  )
}


// ─── Fetch Trending Posts ─────────────────────────────────────────────────────

export async function fetchTrendingSocialPosts(): Promise<SocialPost[]> {
  await simulateDelay(200)

  // Sort by likes + shares to simulate trending
  return [...ALL_POSTS]
    .sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares))
    .slice(0, 5)
}


// ─── Fetch Posts by Platform ──────────────────────────────────────────────────

export async function fetchPostsByPlatform(
  platform: 'twitter' | 'instagram',
  page: number = 1,
  pageSize: number = 6
): Promise<SocialPost[]> {

  await simulateDelay(200)

  const filtered = ALL_POSTS.filter(p => p.platform === platform)
  const start    = (page - 1) * pageSize
  const end      = start + pageSize

  return filtered.slice(start, end)
}


// ─── Helper ───────────────────────────────────────────────────────────────────

// Simulates real API network delay
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}