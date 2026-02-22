/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  '#FFF4EC',
          100: '#FFE4CC',
          200: '#FFC799',
          300: '#FFA366',
          400: '#FF8033',
          500: '#FF6B35',
          600: '#E55A20',
          700: '#CC4A10',
          800: '#A33A08',
          900: '#7A2C05',
        },
        neelkanth: {
          50:  '#EEF2FF',
          100: '#D4DCFA',
          200: '#A9B9F5',
          300: '#7E96F0',
          400: '#5373EB',
          500: '#1E3A5F',
          600: '#182F4C',
          700: '#122539',
          800: '#0C1A26',
          900: '#060D13',
        },
        gold: {
          50:  '#FFFBEA',
          100: '#FFF4C2',
          200: '#FFE785',
          300: '#FFD948',
          400: '#FFD700',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9C7D25',
          800: '#80641C',
          900: '#644B13',
        },
        bhasma: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'serif'],
      },
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, #0C1A26 0%, #1a0a00 50%, #0C1A26 100%)',
        'saffron-glow': 'radial-gradient(ellipse at center, rgba(255,107,53,0.15) 0%, transparent 70%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
      },
      animation: {
        'pulse-sacred': 'pulse-sacred 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'om-spin': 'spin 20s linear infinite',
      },
      keyframes: {
        'pulse-sacred': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
