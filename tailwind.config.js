/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Exo 2'", 'system-ui', 'sans-serif'],
        display: ["'Rajdhani'", 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: '#0A0F1E',
        sky:  '#37B5E9',
        volt: '#4B4BED',
      },
      backgroundImage: {
        'game-grad': 'linear-gradient(135deg, #37B5E9 0%, #4B4BED 100%)',
        'gold-grad':  'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      },
      keyframes: {
        'float': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':     { transform: 'translateY(-12px) rotate(180deg)' },
        },
        'score-pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%,100%': { boxShadow: '0 0 20px rgba(55,181,233,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(55,181,233,0.7), 0 0 80px rgba(75,75,237,0.4)' },
        },
      },
      animation: {
        float:      'float 3s ease-in-out infinite',
        'score-pop':'score-pop 0.25s ease-out',
        'slide-up': 'slide-up 0.4s ease-out both',
        glow:       'glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
