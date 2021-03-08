const colors = require('tailwindcss/colors')

module.exports = isProd => ({
    prefix: '',
    purge: {
        enabled: true /*isProd*/,
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
            height: theme => ({
                'screen/custom': '90vh',
                'screen/2': '50vh',
                'screen/3': 'calc(100vh / 3)',
                'screen/4': 'calc(100vh / 4)',
                'screen/5': 'calc(100vh / 5)'
            })
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
})
