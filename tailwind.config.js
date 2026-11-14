/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HoaLang UI Rule v1.0 Palette (Luxury Editorial × Vietnamese Cultural Depth)
        parchment: '#F5F0E8', // Nền trang chính — màu giấy dó
        cream:     '#FAF7F2', // Nền card, panel, section xen kẽ
        ink:       '#1A1208', // Text chính
        charcoal:  '#2E2318', // Section tối, footer, heading đậm
        lacquer:   '#8B1A1A', // Đỏ sơn mài — button primary, accent chính
        gold:      '#C4952A', // Vàng nghệ — section label, tag, icon
        bronze:    '#7A5C2E', // Nâu đồng — link, hover state
        stone:     '#D4C9B5', // Border, divider, input border
        ash:       '#8C8070', // Text phụ, caption, placeholder

        // Vietnamese Cultural Palette (Backward compatibility)
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
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Be Vietnam Pro', 'Helvetica Neue', 'sans-serif'],
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
          'Cormorant Garamond',
          'Merriweather',
          'Playfair Display',
          'Georgia',
          'serif'
        ]
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        md: '6px',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        content: '1400px',
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
