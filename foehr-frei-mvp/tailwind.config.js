/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
theme: {
  extend: {
    colors: {
      navy: '#0F172A',
      north: '#2563EB',
      sea: '#059669',
      sand: '#F1EDE3',
      cloud: '#F8FAFC',
      coral: '#F97316',
    },
    borderRadius: { xl2: '1rem' },
    boxShadow: { soft: '0 8px 30px rgba(2, 6, 23, .06)' },
  },
}
