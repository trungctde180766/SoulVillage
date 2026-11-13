/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vietnamese Cultural Palette
        primary: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59', // Deep Emerald
          900: '#0f4c3a', // Heritage Jade
          950: '#062d22',
        },
        ivory: {
          50: '#ffffff',
          100: '#fdfbf7', // Warm Ivory background
          200: '#f8f4ec',
          300: '#f1ebd9',
          400: '#e5dcbe',
          500: '#d5c79e',
        },
        terracotta: {
          50: '#fef3ee',
          100: '#fce5d8',
          200: '#f9cbb1',
          300: '#f4a682',
          400: '#ed7b52',
          500: '#c25e2e', // Hue Terracotta
          600: '#ab4923',
          700: '#8f381c',
          800: '#752f1b',
          900: '#61291a',
        },
        ochre: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706', // Imperial Ochre
          600: '#b45309',
        }
      },
      fontFamily: {
        sans: [
          'Be Vietnam Pro',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Merriweather',
          'Playfair Display',
          'Georgia',
          'serif'
        ]
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 76, 58, 0.08)',
        'card': '0 10px 30px -5px rgba(15, 76, 58, 0.1)',
        'elevated': '0 20px 40px -15px rgba(194, 94, 46, 0.15)',
      }
    },
  },
  plugins: [],
}
