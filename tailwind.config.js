/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        archi: {
          sain: '#4CAF50',
          stresse: '#FFC107',
          resilient: '#2196F3',
          descente: '#FF9800',
          repli: '#9C27B0',
          irreversible: '#F44336',
          mort: '#1a1a1a',
          senescent: '#9E9E9E',
          colonie: '#795548',
          forest: '#2E7D32',
          forestLight: '#4CAF50',
          forestDark: '#1B5E20',
        }
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
