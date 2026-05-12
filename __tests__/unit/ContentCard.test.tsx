// ============================================================
//   __tests__/unit/ContentCard.test.tsx
//   Unit tests for ContentCard component
//   Tests:
//   - Renders correctly for news, movie, social types
//   - Favorite button toggles correctly
//   - Empty/missing image fallback
//   - CTA button labels per type
//   - Accessibility attributes
// ============================================================

import React                         from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider }                  from 'react-redux'
import { configureStore }            from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import ContentCard                   from '@/components/feed/ContentCard'
import favoritesReducer              from '@/store/favoritesSlice'
import preferencesReducer            from '@/store/preferencesSlice'
import type { NewsArticle, Movie, SocialPost } from '@/types'


// ─── Mock Framer Motion ───────────────────────────────────────────────────────
// Framer Motion doesn't work in jsdom — replace with simple divs

jest.mock('framer-motion', () => ({
  motion: {
    div:    ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))


// ─── Mock next/image ──────────────────────────────────────────────────────────

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))


// ─── Test Store Factory ───────────────────────────────────────────────────────
// Creates a fresh Redux store for each test

function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      favorites:   favoritesReducer,
      preferences: preferencesReducer,
    },
    preloadedState,
  })
}


// ─── Render Helper ────────────────────────────────────────────────────────────

function renderWithStore(
  ui: React.ReactElement,
  store = makeStore()
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}


// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockNewsArticle: NewsArticle = {
  id:          'news_001',
  type:        'news',
  title:       'Test News Article Title',
  description: 'This is a test news article description.',
  content:     'Full content of the test news article.',
  url:         'https://example.com/news/test',
  imageUrl:    'https://example.com/image.jpg',
  source:      'Test Source',
  author:      'Test Author',
  category:    'technology',
  publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  isFavorite:  false,
}

const mockMovie: Movie = {
  id:          'movie_001',
  type:        'movie',
  title:       'Test Movie Title',
  description: 'This is a test movie description.',
  imageUrl:    'https://example.com/poster.jpg',
  rating:      8.5,
  releaseDate: '2024-01-15',
  genres:      ['Action', 'Thriller'],
  voteCount:   5000,
  popularity:  75.4,
  isFavorite:  false,
}

const mockSocialPost: SocialPost = {
  id:       'social_001',
  type:     'social',
  content:  'This is a test social media post content #testing #react',
  imageUrl: null,
  author: {
    name:      'Test User',
    username:  'testuser',
    avatarUrl: null,
  },
  hashtags:    ['testing', 'react'],
  likes:       1234,
  comments:    56,
  shares:      78,
  platform:    'twitter',
  publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  isFavorite:  false,
}


// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ContentCard', () => {

  // ── News Card ──────────────────────────────────────────────────────────

  describe('News Card', () => {
    it('renders news article title', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      expect(
        screen.getByText('Test News Article Title')
      ).toBeInTheDocument()
    })

    it('renders news article description', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      expect(
        screen.getByText('This is a test news article description.')
      ).toBeInTheDocument()
    })

    it('renders news type badge', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      expect(screen.getByText(/News/i)).toBeInTheDocument()
    })

    it('renders Read More CTA button', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      expect(
        screen.getByRole('link', { name: /read more/i })
      ).toBeInTheDocument()
    })

    it('Read More link has correct href', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      const link = screen.getByRole('link', { name: /read more/i })
      expect(link).toHaveAttribute('href', 'https://example.com/news/test')
    })

    it('renders source name in subtitle', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      expect(screen.getByText(/Test Source/)).toBeInTheDocument()
    })
  })


  // ── Movie Card ──────────────────────────────────────────────────────────

  describe('Movie Card', () => {
    it('renders movie title', () => {
      renderWithStore(<ContentCard item={mockMovie} />)
      expect(screen.getByText('Test Movie Title')).toBeInTheDocument()
    })

    it('renders movie rating badge', () => {
      renderWithStore(<ContentCard item={mockMovie} />)
      expect(screen.getByText(/8.5/)).toBeInTheDocument()
    })

    it('renders movie genres', () => {
      renderWithStore(<ContentCard item={mockMovie} />)
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Thriller')).toBeInTheDocument()
    })

    it('renders movie type badge', () => {
      renderWithStore(<ContentCard item={mockMovie} />)
      expect(screen.getByText(/Movie/i)).toBeInTheDocument()
    })

    it('renders View Details CTA button', () => {
      renderWithStore(<ContentCard item={mockMovie} />)
      expect(
        screen.getByRole('button', { name: /view details/i })
      ).toBeInTheDocument()
    })
  })


  // ── Social Card ─────────────────────────────────────────────────────────

  describe('Social Card', () => {
    it('renders social post content', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(
        screen.getByText(/This is a test social media post content/)
      ).toBeInTheDocument()
    })

    it('renders author name', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('renders author username', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(screen.getByText('@testuser')).toBeInTheDocument()
    })

    it('renders hashtags', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(screen.getByText('#testing')).toBeInTheDocument()
      expect(screen.getByText('#react')).toBeInTheDocument()
    })

    it('renders social type badge', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(screen.getByText(/Social/i)).toBeInTheDocument()
    })

    it('renders formatted like count', () => {
      renderWithStore(<ContentCard item={mockSocialPost} />)
      expect(screen.getByText(/1.2K/)).toBeInTheDocument()
    })
  })


  // ── Favorite Button ─────────────────────────────────────────────────────

  describe('Favorite Button', () => {
    it('renders unfavorited heart button by default', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      const btn = screen.getByRole('button', { name: /add to favorites/i })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('aria-pressed', 'false')
    })

    it('renders favorited heart when item is in favorites store', () => {
      const store = makeStore({
        favorites: { ids: ['news_001'] },
      })
      renderWithStore(<ContentCard item={mockNewsArticle} />, store)
      const btn = screen.getByRole('button', { name: /remove from favorites/i })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('aria-pressed', 'true')
    })

    it('dispatches toggleFavorite when heart is clicked', () => {
      const store = makeStore()
      renderWithStore(<ContentCard item={mockNewsArticle} />, store)

      const btn = screen.getByRole('button', { name: /add to favorites/i })
      fireEvent.click(btn)

      const state = store.getState() as any
      expect(state.favorites.ids).toContain('news_001')
    })

    it('removes from favorites when clicked again', () => {
      const store = makeStore({
        favorites: { ids: ['news_001'] },
      })
      renderWithStore(<ContentCard item={mockNewsArticle} />, store)

      const btn = screen.getByRole('button', { name: /remove from favorites/i })
      fireEvent.click(btn)

      const state = store.getState() as any
      expect(state.favorites.ids).not.toContain('news_001')
    })
  })


  // ── Accessibility ───────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has data-cy attribute for Cypress tests', () => {
      const { container } = renderWithStore(
        <ContentCard item={mockNewsArticle} />
      )
      expect(
        container.querySelector('[data-cy="content-card"]')
      ).toBeInTheDocument()
    })

    it('has data-type attribute matching content type', () => {
      const { container } = renderWithStore(
        <ContentCard item={mockNewsArticle} />
      )
      expect(
        container.querySelector('[data-type="news"]')
      ).toBeInTheDocument()
    })

    it('image has alt text', () => {
      renderWithStore(<ContentCard item={mockNewsArticle} />)
      const img = screen.getByAltText('Test News Article Title')
      expect(img).toBeInTheDocument()
    })
  })


  // ── Edge Cases ──────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('renders without image gracefully', () => {
      const noImageArticle = { ...mockNewsArticle, imageUrl: null }
      expect(() =>
        renderWithStore(<ContentCard item={noImageArticle} />)
      ).not.toThrow()
    })

    it('renders movie with no genres', () => {
      const noGenreMovie = { ...mockMovie, genres: [] }
      renderWithStore(<ContentCard item={noGenreMovie} />)
      expect(screen.getByText('Test Movie Title')).toBeInTheDocument()
    })

    it('truncates long social post content', () => {
      const longPost = {
        ...mockSocialPost,
        content: 'A'.repeat(300),
      }
      renderWithStore(<ContentCard item={longPost} />)
      // Should not render full 300 chars
      const content = screen.getByText(/A+\.\.\./)
      expect(content).toBeInTheDocument()
    })
  })
})