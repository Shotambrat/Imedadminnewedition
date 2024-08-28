module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        'custom-light': '0 0px 40px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-heavy': '0 0 25px 35px rgba(255, 255, 255, 1)',
      },
      colors: {
        greentxt: 'var(--Green-Green-100, #088133)',
        blacklighttxt: 'var(--Black-Black50, #808080)',
        snowy: '#F4F7FE',
        contactBorder: "#E1E1E1",
        redMain: '#E31E24',
        greenCategory: '#E6F2EB',
        modalBg: 'rgba(0, 0, 0, 0.6)',
        subModal: 'rgba(0, 0, 0, 0.8)',
        contactBg: '#E94B50',
      },
    },
    screens: {
      'sm': '320px',
      'md': '360px',
      'mdx': '460px',
      'mdl': '550px',
      'slg': '750px',
      'lg': '900px',
      'xl': '1000px',
      '2xl': '1100px',
      '3xl': '1440px',
      '4xl': '1600px',
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
