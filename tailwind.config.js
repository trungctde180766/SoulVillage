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
        parchment: '#F5F0E8', // Nền trang chính — màu giấy dó truyền thống
        cream:     '#FAF7F2', // Nền card, panel, section xen kẽ, ô nhập liệu
        ink:       '#1A1208', // Màu chữ chính (body text), tiêu đề nhỏ
        charcoal:  '#2E2318', // Section tối, footer, header nổi bật, tiêu đề đậm
        lacquer:   '#8B1A1A', // Đỏ sơn mài — button primary, điểm nhấn hành động chính
        gold:      '#C4952A', // Vàng nghệ — section label, tag văn hóa, icon điểm xuyết
        bronze:    '#7A5C2E', // Nâu đồng — liên kết, trạng thái hover, đường nét phụ
        stone:     '#D4C9B5', // Đường viền (border), đường phân cách (divider), input border
        ash:       '#8C8070', // Chữ phụ, ghi chú meta, caption ảnh, placeholder

        // Opacity token aliases used in HoaLang specs
        'gold-20':    'rgba(196, 149, 42, 0.20)',
        'lacquer-15': 'rgba(139, 26, 26, 0.15)',
        'ink-40':     'rgba(26, 18, 8, 0.40)',
        'ink-70':     'rgba(26, 18, 8, 0.70)',

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
          800: '#115e59',
          900: '#0f4c3a',
          950: '#062d22',
        },
        ivory: {
          50: '#FAF7F2',
          100: '#F5F0E8',
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
          500: '#c25e2e',
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
          500: '#d97706',
          600: '#b45309',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Be Vietnam Pro', 'Helvetica Neue', 'sans-serif'],
        sans:    ['Be Vietnam Pro', 'Helvetica Neue', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(48px, 6vw, 80px)', { lineHeight: '1.05', fontWeight: '300' }],
        'display-xl':  ['clamp(36px, 4.5vw, 64px)', { lineHeight: '1.10', fontWeight: '400' }],
        'display-lg':  ['clamp(28px, 3.5vw, 48px)', { lineHeight: '1.15', fontWeight: '400' }],
        'display-md':  ['clamp(22px, 2.5vw, 32px)', { lineHeight: '1.20', fontWeight: '400' }],
        'body-lg':     ['clamp(16px, 1.5vw, 18px)', { lineHeight: '1.80', fontWeight: '300' }],
        'body-md':     ['16px', { lineHeight: '1.70', fontWeight: '400' }],
        'body-sm':     ['14px', { lineHeight: '1.60', fontWeight: '400' }],
        'label-lg':    ['13px', { letterSpacing: '0.10em', fontWeight: '600' }],
        'label-sm':    ['11px', { letterSpacing: '0.15em', fontWeight: '600' }],
        'caption':     ['12px', { lineHeight: '1.50', fontWeight: '400' }],
      },
      borderRadius: {
        DEFAULT: '3px',
        xs: '2px',
        sm: '3px',
        md: '6px',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
      },
      spacing: {
        '18': '4.5rem',
      },
      opacity: {
        '15': '0.15',
        '92': '0.92',
      },
      maxWidth: {
        content: '1400px',
      },
      boxShadow: {
        'hover': '0 16px 40px rgba(26, 18, 8, 0.12)',
        'soft': '0 4px 20px -2px rgba(26, 18, 8, 0.08)',
        'card': '0 10px 30px -5px rgba(26, 18, 8, 0.10)',
        'elevated': '0 20px 40px -15px rgba(139, 26, 26, 0.15)',
      },
    },
  },
  plugins: [],
}
