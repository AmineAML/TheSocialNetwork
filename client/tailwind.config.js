const colors = require('tailwindcss/colors')

module.exports = (isProd) => ({
    prefix: '',
    purge: {
      enabled: true/*isProd*/,
      content: [
        './src/**/*.{html,ts}',
        '.projects/src/**/*.{html,ts}',
        '.projects/src/**/*.{html,ts,scss}',
        '**/*.html',
        '**/*.ts',
        '**/*.scss'
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
