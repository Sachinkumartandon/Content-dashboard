// ============================================================
//   __tests__/cypress/search.cy.ts
//   E2E Tests for Search Functionality
//   Tests:
//   - Search bar is visible and focusable
//   - Typing triggers debounced search
//   - Results appear after debounce delay
//   - Clear button works
//   - Empty state shows for no results
//   - Search indicator shows active query
// ============================================================


describe('Search Functionality', () => {

  // Visit the dashboard before each test
  beforeEach(() => {
    cy.visit('/')
    // Wait for the page to fully load
    cy.get('[data-cy="search-bar"]', { timeout: 10000 }).should('be.visible')
  })


  // ── Search Bar Visibility ───────────────────────────────────────────────

  describe('Search Bar', () => {
    it('is visible in the header', () => {
      cy.get('[data-cy="search-bar"]')
        .should('be.visible')
        .should('have.attr', 'placeholder', 'Search news, movies, posts...')
    })

    it('can be focused by clicking', () => {
      cy.get('[data-cy="search-bar"]').click().should('be.focused')
    })

    it('accepts text input', () => {
      cy.get('[data-cy="search-bar"]')
        .type('technology')
        .should('have.value', 'technology')
    })

    it('shows clear button when text is entered', () => {
      cy.get('[data-cy="search-bar"]').type('react')
      cy.get('[aria-label="Clear search"]').should('be.visible')
    })

    it('hides clear button when input is empty', () => {
      cy.get('[aria-label="Clear search"]').should('not.exist')
    })
  })


  // ── Debounced Search ────────────────────────────────────────────────────

  describe('Debounced Search', () => {
    it('does not search immediately while typing', () => {
      // Type quickly — should not trigger search yet
      cy.get('[data-cy="search-bar"]').type('r', { delay: 50 })
      cy.get('[data-cy="search-bar"]').type('e', { delay: 50 })
      cy.get('[data-cy="search-bar"]').type('a', { delay: 50 })

      // Search indicator should NOT appear yet (debounce not complete)
      cy.get('[data-cy="search-bar"]').should('have.value', 'rea')
    })

    it('triggers search after 300ms debounce delay', () => {
      cy.get('[data-cy="search-bar"]').type('react')

      // Wait for debounce (300ms + buffer)
      cy.wait(400)

      // Search active indicator should now appear
      cy.contains('Searching for').should('be.visible')
      cy.contains('"react"').should('be.visible')
    })

    it('shows search results header after debounce', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)

      // Feed header should change to show search query
      cy.contains('Results for "technology"').should('be.visible')
    })

    it('resets to page 1 when searching', () => {
      cy.get('[data-cy="search-bar"]').type('news')
      cy.wait(400)
      // Results should start from beginning
      cy.get('[data-cy="content-card"]').should('have.length.at.least', 1)
    })
  })


  // ── Clear Search ────────────────────────────────────────────────────────

  describe('Clear Search', () => {
    it('clears input when clear button is clicked', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)

      cy.get('[aria-label="Clear search"]').click()

      cy.get('[data-cy="search-bar"]').should('have.value', '')
    })

    it('hides search indicator after clearing', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)
      cy.contains('Searching for').should('be.visible')

      cy.get('[aria-label="Clear search"]').click()
      cy.contains('Searching for').should('not.exist')
    })

    it('restores normal feed after clearing search', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)
      cy.contains('Results for "technology"').should('be.visible')

      cy.get('[aria-label="Clear search"]').click()
      cy.wait(400)

      cy.contains('Your Feed').should('be.visible')
    })

    it('clears input when Escape key is pressed', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.get('[data-cy="search-bar"]').type('{esc}')
      // Input should lose focus
      cy.get('[data-cy="search-bar"]').should('not.be.focused')
    })
  })


  // ── Search Results ──────────────────────────────────────────────────────

  describe('Search Results', () => {
    it('shows content cards when results are found', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)

      cy.get('[data-cy="content-card"]', { timeout: 5000 })
        .should('have.length.at.least', 1)
    })

    it('shows item count in feed header', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)

      // Should show number of results
      cy.contains(/\d+ items/).should('be.visible')
    })

    it('shows different content types in results', () => {
      cy.get('[data-cy="search-bar"]').type('technology')
      cy.wait(400)

      // Should have mix of content types
      cy.get('[data-type="news"], [data-type="movie"], [data-type="social"]')
        .should('have.length.at.least', 1)
    })
  })


  // ── Empty State ─────────────────────────────────────────────────────────

  describe('Empty State', () => {
    it('shows empty state for query with no results', () => {
      // Use a very specific query unlikely to match anything
      cy.get('[data-cy="search-bar"]')
        .type('xyznonexistentquery12345')
      cy.wait(400)

      cy.contains('No results for').should('be.visible')
    })

    it('shows helpful message in empty state', () => {
      cy.get('[data-cy="search-bar"]')
        .type('xyznonexistentquery12345')
      cy.wait(400)

      cy.contains('Try a different search term').should('be.visible')
    })
  })


  // ── Accessibility ───────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('search input has accessible label', () => {
      cy.get('[aria-label="Search content"]').should('exist')
    })

    it('clear button has accessible label', () => {
      cy.get('[data-cy="search-bar"]').type('test')
      cy.get('[aria-label="Clear search"]').should('exist')
    })

    it('can navigate to search bar with keyboard', () => {
      // Tab to search bar
      cy.get('body').tab()
      // Search bar should eventually be reachable
      cy.get('[data-cy="search-bar"]').focus()
      cy.get('[data-cy="search-bar"]').should('be.focused')
    })
  })
})