/** @type {import('tailwindcss').Config} */
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`

export default {
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
        band: withAlpha('--band'),
        'band-card': withAlpha('--band-card'),
        'band-fg': withAlpha('--band-fg'),
        'band-muted': withAlpha('--band-muted'),
        'band-rule': withAlpha('--band-rule'),
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
          '-apple-system',
          '"PingFang SC"',
          '"Helvetica Neue"',
          '"Microsoft YaHei"',
          '"Segoe UI"',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', '"SF Mono"', '"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      // 超重大标题压行高收字距;正文行距放宽
      fontSize: {
        display: ['clamp(2.5rem, 5.7vw, 4.7rem)', { lineHeight: '1.14', letterSpacing: '-0.035em' }],
        headline: ['clamp(1.85rem, 3.6vw, 2.9rem)', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        title: ['1.25rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        body: ['1rem', { lineHeight: '1.85' }],
        label: ['0.875rem', { lineHeight: '1.6' }],
        eyebrow: ['0.68rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
      borderRadius: {
        lg2: '10px',
        xl2: '14px',
        '2xl2': '18px',
      },
      maxWidth: {
        content: '82rem',
      },
      transitionTimingFunction: {
        spring: 'var(--spring)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        ping2: { '0%': { transform: 'scale(0.6)', opacity: '0.7' }, '80%, 100%': { transform: 'scale(1.5)', opacity: '0' } },
        tick: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.22,1,0.36,1) both',
        ping2: 'ping2 2.2s cubic-bezier(0.22,1,0.36,1) infinite',
        tick: 'tick 46s linear infinite',
      },
    },
  },
  plugins: [],
}
