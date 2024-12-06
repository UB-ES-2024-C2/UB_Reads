module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest",
      "^.+\\.css$": "jest-transform-css"

    },
    moduleNameMapper: {
      '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1'
    }
}
