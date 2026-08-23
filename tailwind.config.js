export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: '#7c9dff',
        navy: {
          900: '#0f1729',
          850: '#121b30',
          800: '#151f36',
          700: '#1c2a47'
        },
        graphite: {
          950: '#20211f',
          900: '#282927',
          800: '#30312f',
          700: '#40413e'
        }
      },
      boxShadow: {
        glow: '0 20px 80px rgba(124, 157, 255, 0.18)'
      }
    }
  },
  plugins: []
};
