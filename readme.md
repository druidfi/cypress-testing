# Cypress testing kit

Cypress testing kit built with npm for Drupal projects.

## Setting up

Create a folder `tests` in your project root (if not existing already) and move a content of this repo there.

### Variables

First, set project specific variables under the `cypress/fixtures` folder, e.g. core version, php version, test user's name, role and test content.

Project's `baseUrl` should be set in the `.env` project file, just copy a content of .env.cypress to the .env file.

### Install packages

Run the following inside the `/test` folder:

```
npm i
```

### Run tests using Cypress UI

Run the following inside the `/tests` folder:

```
npx cypress open
```

Click E2E testing and choose a browser you want to use.

The next view lists test files (specs) available.

To start using user-permissions.cy.js, click it.

The tests start to run.

## Run tests using Cypress headless

Run the following inside `/tests` folder:

```
npx cypress run
```

To run a specific set of tests, specify a file name, e.g.:

```
npx cypress run --spec cypress/e2e/user-permissions.cy.js
```
