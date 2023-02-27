const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      CYPRESS_API_URL: 'http://localhost:4001',
      CYPRESS_GRAPHQL_URL: 'http://server:4001/graphql',
    },
  },
});
