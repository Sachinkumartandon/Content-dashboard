import type { Config } from 'tailwindcss'

const config: Config = {
  // Dark mode via data-theme attribute on <html>
  darkMode: ['class', "[data-theme='dark']"],

  // Tell Tailwind where to look for class names (for tree-shaking unused styles)
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Brand color palette
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',   // primary brand color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Dark mode surface colors
        dark: {
          bg:      '#0f172a',   // page background
          surface: '#1e293b',   // card background
          border:  '#334155',   // borders
          muted:   '#64748b',   // muted text
        },
      },

      // Custom font family
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      // Custom border radius
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },

      // Custom box shadows for cards
      boxShadow: {
        'card':       '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.14)',
        'dark-card':  '0 2px 8px rgba(0,0,0,0.4)',
      },

      // Custom animations for Framer Motion fallbacks
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        fadeIn:  'fadeIn 0.3s ease-out forwards',
        spin:    'spin 0.8s linear infinite',
      },

      // Responsive sidebar width
      width: {
        sidebar: '240px',
      },

      // Screen breakpoints (Next.js default + custom)
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },

  plugins: [],
}

export default config