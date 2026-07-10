/** @type {import('tailwindcss').Config} */
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./*.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: withAlpha('--canvas'),
        surface: withAlpha('--surface'),
        elevated: withAlpha('--elevated'),
        subtle: withAlpha('--subtle'),
        fill: withAlpha('--fill'),
        line: withAlpha('--line'),
        'line-strong': withAlpha('--line-strong'),
        fg: withAlpha('--fg'),
        'fg-soft': withAlpha('--fg-soft'),
        muted: withAlpha('--muted'),
        faint: withAlpha('--faint'),
        accent: withAlpha('--accent'),
        'accent-hi': withAlpha('--accent-hi'),
        'accent-fg': withAlpha('--accent-fg'),
        success: withAlpha('--success'),
        warn: withAlpha('--warn'),
        danger: withAlpha('--danger'),
        brand: {
          50: withAlpha('--accent-050'),
          100: withAlpha('--accent-100'),
          200: withAlpha('--accent-200'),
          300: withAlpha('--accent-300'),
          400: withAlpha('--accent-400'),
          500: withAlpha('--accent'),
          600: withAlpha('--accent-hi'),
          700: withAlpha('--accent-700'),
        },
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
        glow: 'var(--shadow-glow)',
        apple: 'var(--shadow-card)',
        'apple-lg': 'var(--shadow-pop)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'system-ui',
          '"PingFang SC"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      // 排版刻度参考 publish-hub：大字号收紧字距，中文小字放松一点
      fontSize: {
        display: ['clamp(2.25rem, 5.2vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        headline: ['clamp(1.75rem, 3.2vw, 2.5rem)', { lineHeight: '1.18', letterSpacing: '-0.022em' }],
        title: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.012em' }],
        body: ['1rem', { lineHeight: '1.75' }],
        label: ['0.875rem', { lineHeight: '1.5' }],
        eyebrow: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        lg2: '10px',
        xl2: '14px',
        '2xl2': '18px',
      },
      maxWidth: {
        content: '68rem',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
