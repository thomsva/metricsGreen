const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        log(args) {
          console.log(...args);
          return null;
        },
      });
    },
    env: {
      CYPRESS_API_URL: "http://localhost:4001",
      CYPRESS_GRAPHQL_URL: "http://localhost:4001/graphql",
      ELECTRON_ENABLE_LOGGING: 1,
    },
    video: false,
    screenshotOnRunFailure: false,
  },
});
