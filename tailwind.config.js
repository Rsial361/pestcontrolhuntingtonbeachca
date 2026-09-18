module.exports = {
  content: [
    "./src/**/*.{njk,html,md}",
    "./src/**/*.svg"
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
        slate: {
          50: '#F8FAFC',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
