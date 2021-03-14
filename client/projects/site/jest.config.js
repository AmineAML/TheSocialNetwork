const baseConfig = require('../../jest.config')

module.exports = {
    ...baseConfig,
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/projects/site/tsconfig.spec.json'
        }
    }
}
