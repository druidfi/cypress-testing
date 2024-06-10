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
  }
});
