/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Palette principale HackShield Dashboard */
        bg: '#0F172A',
        surface: '#1E293B',
        'surface-light': '#273548',
        primary: '#8B5CF6',
        'primary-dim': '#7C3AED',
        accent: '#EC4899',
        'accent-dim': '#DB2777',
        txt: '#F8FAFC',
        'txt-secondary': '#94A3B8',
        'txt-muted': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.15)',
        'glow-strong': '0 0 30px rgba(139, 92, 246, 0.25)',
        'glow-accent': '0 0 20px rgba(236, 72, 153, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
