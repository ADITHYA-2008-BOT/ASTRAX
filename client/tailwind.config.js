/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#040711',
          darker: '#080d1e',
          dark: '#0d1527',
          surface: '#111c35',
          border: 'rgba(0, 245, 255, 0.18)',
          'border-hover': 'rgba(0, 245, 255, 0.45)',
          cyan: '#00f5ff',
          neon: '#00ffcc',
          purple: '#a855f7',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
        display: ['Orbitron', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 245, 255, 0.35)',
        'cyan-glow-lg': '0 0 35px 2px rgba(0, 245, 255, 0.45)',
        'purple-glow': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'purple-glow-lg': '0 0 35px 2px rgba(168, 85, 247, 0.45)',
        'hud': 'inset 0 0 15px rgba(0, 245, 255, 0.08), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'levitate': 'levitate 4s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        levitate: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(0deg)' },
          '75%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' },
        },
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(0, 245, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 245, 255, 0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
