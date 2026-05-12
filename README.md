# ContentDash — Personalized Content Dashboard

A modern, interactive personalized content dashboard built with **Next.js 14**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. Fetches real-time news, movie recommendations, and social media posts in one unified feed.



---

## 🚀 Live Demo

🔗 **[View Live Demo](https://content-dashboard-kappa-ruby.vercel.app/)**

---

## ✨ Features

### Core Features
- 📰 **Personalized News Feed** — Real news from NewsAPI based on your selected categories
- 🎬 **Movie Recommendations** — Latest movies from TMDB API
- 💬 **Social Media Posts** — Mock social posts (Twitter/Instagram style)
- ❤️ **Favorites** — Save any content card and view it in a dedicated section
- 🔥 **Trending** — Top trending content across all categories
- 🔍 **Debounced Search** — Search across news, movies and social posts (300ms debounce)
- 🌙 **Dark Mode** — Full dark/light theme toggle with CSS custom properties
- ↕️ **Drag & Drop** — Reorder feed cards with React DnD
- ♾️ **Infinite Scroll** — Automatically loads more content as you scroll
- ⚙️ **Settings Panel** — Customize categories, language, layout and items per page

### Bonus Features
- 🌍 **Multi-language Support** — English, Hindi, Spanish, French, German, Japanese
- 🔒 **Secure API Handling** — All API keys server-side only via Next.js Route Handlers
- 💾 **Persistent State** — Preferences and favorites saved to localStorage via Redux Persist

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS Custom Properties |
| State Management | Redux Toolkit + RTK Query |
| Persistence | Redux Persist → localStorage |
| Animations | Framer Motion |
| Drag & Drop | React DnD |
| i18n | react-i18next |
| Unit Testing | Jest + React Testing Library |
| E2E Testing | Cypress |
| API Mocking | MSW (Mock Service Worker) |

---

## 📁 Project Structure

```
personalized-content-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # Server-side API route handlers
│   │   │   ├── news/           # GET /api/news
│   │   │   ├── recommendations/# GET /api/recommendations
│   │   │   └── social/         # GET /api/social
│   │   ├── favorites/          # /favorites page
│   │   ├── trending/           # /trending page
│   │   ├── settings/           # /settings page
│   │   ├── layout.tsx          # Root layout + metadata
│   │   ├── page.tsx            # Dashboard home
│   │   └── providers.tsx       # Redux + DnD providers
│   ├── components/
│   │   ├── ui/                 # Spinner, Skeleton, DarkModeToggle
│   │   ├── layout/             # Sidebar, Header, DashboardLayout
│   │   ├── feed/               # ContentCard, DraggableCard, FeedContainer
│   │   ├── trending/           # TrendingSection
│   │   └── favorites/          # FavoritesSection
│   ├── store/                  # Redux slices + RTK Query
│   │   ├── preferencesSlice.ts
│   │   ├── favoritesSlice.ts
│   │   ├── feedSlice.ts
│   │   ├── contentApi.ts
│   │   └── index.ts
│   ├── hooks/                  # useDebounce, useInfiniteScroll, useLocalStorage
│   ├── lib/                    # API clients, utils, constants, mock data
│   └── types/                  # Shared TypeScript interfaces
├── __tests__/
│   ├── unit/                   # Jest + RTL unit tests
│   └── cypress/                # Cypress E2E tests
├── .env.example                # Environment variables template
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18.17 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/personalized-content-dashboard.git
cd personalized-content-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Open `.env.local` and add your API keys:
```env
NEWS_API_KEY=your_newsapi_key_here
TMDB_API_KEY=your_tmdb_api_key_here
NEXTAUTH_SECRET=any_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

> **Get free API keys:**
> - NewsAPI → [newsapi.org/register](https://newsapi.org/register)
> - TMDB → [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
>
> **Note:** The app works without API keys using built-in mock data.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Running Tests

### Unit Tests (Jest + React Testing Library)
```bash
# Run all unit tests
npm run test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### E2E Tests (Cypress)
```bash
# Make sure dev server is running first
npm run dev

# Run Cypress headlessly (CI mode)
npm run test:e2e

# Open Cypress interactive UI
npm run test:e2e:open
```

---

## 🌐 API Routes

All API routes are server-side. API keys never reach the browser.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/news` | GET | Fetch news by categories or search query |
| `/api/recommendations` | GET | Fetch movie recommendations from TMDB |
| `/api/social` | GET | Fetch mock social media posts |

### Query Parameters

**`/api/news`**
```
?categories=technology,sports  → filter by categories
?query=bitcoin                 → search news
?page=1&pageSize=10           → pagination
```

**`/api/recommendations`**
```
?categories=entertainment      → filter by category
?query=batman                  → search movies
?trending=true                 → get trending movies
?page=1                        → pagination
```

**`/api/social`**
```
?page=1&pageSize=6            → pagination
?hashtag=ReactJS              → filter by hashtag
?platform=twitter             → filter by platform
?trending=true                → get trending posts
```

---

## 🎨 User Flow

```
1. Open app → sees personalized feed (news + movies + social)
2. Search → debounced search across all content types
3. Click ❤️ on any card → saved to Favorites
4. Visit /favorites → see all saved content
5. Visit /trending → see trending content by category
6. Visit /settings → customize categories, dark mode, language
7. Drag cards → reorder feed to preference
8. Scroll to bottom → infinite scroll loads more content
```

---

## 🔒 Security

- ✅ API keys stored in `.env.local` (never committed)
- ✅ All API calls proxied through Next.js server routes
- ✅ Security headers added (X-Frame-Options, XSS-Protection)
- ✅ Input validation on all API routes
- ✅ `.env.local` in `.gitignore` by default

---

## 📱 Responsive Design

| Screen | Layout |
|--------|--------|
| Mobile (<768px) | Single column, slide-in sidebar |
| Tablet (768-1024px) | 2 column grid |
| Desktop (>1024px) | 3 column grid, fixed sidebar |

---

## 🤝 Assignment Checklist

- [x] Personalized content feed (news + movies + social)
- [x] User preferences with settings panel
- [x] Infinite scroll / pagination
- [x] Debounced search (300ms)
- [x] Drag and drop reordering (React DnD)
- [x] Dark mode (CSS custom properties + Tailwind)
- [x] Framer Motion animations
- [x] Redux Toolkit state management
- [x] RTK Query for async data fetching
- [x] Redux Persist for localStorage sync
- [x] Unit tests (Jest + RTL)
- [x] E2E tests (Cypress)
- [x] TypeScript (strict mode)
- [x] Responsive design
- [x] Multi-language support (bonus)
- [x] Security headers (bonus)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/Sachinkumartandon)
- Email: your-sachinkumartandan85@example.com

---

*Built with ❤️ using Next.js, TypeScript and Redux Toolkit*
