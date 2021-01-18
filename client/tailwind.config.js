const colors = require('tailwindcss/colors')

module.exports = (isProd) => ({
    prefix: '',
    purge: {
      enabled: isProd,
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'light-blue': colors.lightBlue,
          cyan: colors.cyan,
          amethyst: '#9966cc',
          bedrock: '#F4D5B0',
          orange: colors.orange
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
});
