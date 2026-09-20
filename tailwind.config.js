/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Facto Neo-Fintech Tokens
        facto: {
          pink: '#f243ac',
          pinkHover: '#ff4ca0',
          dark: '#0d0e11',
          surface: '#f4f4f4',
          card: '#ffffff',
          border: '#e6eded',
          borderSubtle: '#eeeeee',
          green: '#008638',
          greenLight: '#58e78f',
          red: '#ff3b57',
          gray: '#646464',
          grayLight: '#0d0e1180',
        },
        // Dynamic CSS Var references for theme switching
        app: {
          bg: 'var(--app-bg)',
          card: 'var(--app-card)',
          elev: 'var(--app-elev)',
          'elev-2': 'var(--app-elev-2)',
          border: 'var(--app-border)',
          'border-subtle': 'var(--app-border-subtle)',
          fg: 'var(--app-fg)',
          'fg-muted': 'var(--app-fg-muted)',
          'fg-dim': 'var(--app-fg-dim)',
          up: 'var(--app-up)',
          down: 'var(--app-down)',
          accent: 'var(--app-accent)',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 229, 153, 0.35)',
        'neon-red': '0 0 20px rgba(255, 59, 87, 0.35)',
        'neon-cyan': '0 0 20px rgba(0, 212, 255, 0.35)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        laserPulse: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.6', transform: 'scaleY(1.3)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'laser-pulse': 'laserPulse 1.8s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      }
    },
  },
  plugins: [],
}
