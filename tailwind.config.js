/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0D0E0F',
          900: '#141517',
          800: '#1C1E21',
          700: '#25282D',
          600: '#3A3F47',
          500: '#4F5560',
        },
        amber: {
          400: '#D4A853',
          300: '#E4C67A',
          200: '#F0DDA0',
          100: '#F5ECD0',
        },
        paper: {
          100: '#F0EBE0',
          200: '#D8D0C4',
          300: '#C0B5A8',
        },
        vermilion: '#C73E1D',
        'vermilion-soft': '#E85D3A',
        jade: {
          600: '#2D7A5F',
          400: '#4CAF8C',
          300: '#7BCFAE',
        },
        cinnabar: {
          500: '#B85C50',
          300: '#D48278',
        },
        fog: '#4A4F5C',
        obsidian: '#0A0A0D',
      },
      fontFamily: {
        'serif-sc': ['Noto Serif SC', 'serif'],
        'sans-sc': ['Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
