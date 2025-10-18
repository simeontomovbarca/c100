/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        terra: {
          50: '#fdf5f1',
          100: '#fce9df',
          200: '#f8d0be',
          300: '#f3ae92',
          400: '#ed8564',
          500: '#e96843',
          600: '#d64f2f',
          700: '#b33d24',
          800: '#913523',
          900: '#762f21',
        },
        forest: {
          50: '#f2f7f5',
          100: '#e0ebe6',
          200: '#c1d7cd',
          300: '#99bbad',
          400: '#6d9b88',
          500: '#507f6c',
          600: '#3d6556',
          700: '#335246',
          800: '#2b4239',
          900: '#263830',
        },
        sage: {
          50: '#f7f8f7',
          100: '#eef0ed',
          200: '#d9ddd8',
          300: '#bcc3bb',
          400: '#9aa39a',
          500: '#7d877c',
          600: '#646e63',
          700: '#515951',
          800: '#434944',
          900: '#393d39',
        },
        gold: {
          50: '#fdfbf7',
          100: '#faf5e8',
          200: '#f3e8c5',
          300: '#ead599',
          400: '#deb962',
          500: '#d4a03a',
          600: '#c68a2f',
          700: '#a56d28',
          800: '#875727',
          900: '#6f4823',
        },
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #263830 0%, #1a1a1a 50%, #2b4239 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      letterSpacing: {
        'luxury': '0.15em',
      },
    },
  },
  plugins: [],
};
