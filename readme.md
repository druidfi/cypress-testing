# Cypress testing kit
Cypress testing kit for Drupal projects built with npm.

## Setting up
Create a folder `tests` in your project root (if not existing already) and move cypress-testing folder there.

### Variables
Project specific variables should be set under fixtures folder, e.g. core version, php version, test user's name, role and test content.

### Install packages
Run the following inside test/cypress-testing:
```
npm i
```

### Run tests using Cypress UI
Run the following inside tests/cypress-testing:
```
npx cypress open
```
Click E2E testing and choose a browser you want to use.

The following view lists the test files available.

To start using user-permissions.cy.js, click it.

The tests start to run.

## Run tests using headless Cypress testing
Run the following inside tests/cypress-testing:
```
npx cypress run
```

