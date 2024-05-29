const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    fixturesFolder: "cypress/fixtures",
    integrationFolder: "cypress/integration",
    pluginsFile: "cypress/plugins/index.js",
    screenshotsFolder: "cypress/screenshots",
    specPattern: "e2e/cypress/**/*.{js,jsx,ts,tsx}",
    supportFile: "support/e2e.js",
    videosFolder: "cypress/videos",
    viewportWidth: 1440,
    viewportHeight: 900
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://awen.docker.so/",
    specPattern: "cypress/e2e/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    // fixturesFolder: "cypress/fixtures"
  },
  env: {
    baseUrl: "https://awen.docker.so/",
  }
});
