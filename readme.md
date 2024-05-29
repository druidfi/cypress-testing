## Set project specific variables
Project specific variables should be set under fixtures folder, e.g. core version, php version, test users name and content.

## Install packages
Run the following inside test/cypress-npm:
```
npm i
```

## Use Cypress testing UI
Run the following inside test/cypress-npm:
```
npx cypress open
```
Click E2E testing and choose a browser you want to use.

The following view lists the test files available.

To start using user-permissions.cy.js, click it.

The tests start to run.

## Use headless Cypress testing
Run the following inside test/cypress-npm:
```
npx cypress run
```

