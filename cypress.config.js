const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
  },
  env: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    // include project-specific selectors and commands and use as Cypress.env(drushCommand)
    drushCommandPrepend: "docker compose exec app bash -c",
    nodeSubmitButtonSelector: "[data-drupal-selector^='edit-submit']",
    drupalAlertMessagesSelector: 'div[role="alert"]',
    contentViewAuthorSelector: 'views-field-uid'
  }
});
