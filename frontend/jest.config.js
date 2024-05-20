// jest.config.js
module.exports = {
  setupFiles: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: ['node_modules/(?!axios)/'],
  moduleNameMapper: {
    '^axios$': 'axios/dist/node/axios.cjs'
  }
};
