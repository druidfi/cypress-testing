// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Defines a cypress command that executes drush commands.
 *
 * Note that our definition of the drush command depends on our environment
 * variable 'drushCommand'. Define this in cypress.json or cypress.env.json
 * based on your local dev setup.
 */
Cypress.Commands.add('drush', (command, args = [], options = {}) => {
  return cy.exec(`${Cypress.env('drushCommandPrepend')} 'drush ${command} ${stringifyArguments(args)} ${stringifyOptions(options)} -y'`, {failOnNonZeroExit: false})
});

/**
 * Returns a series of arguments, separated by spaces.
 *
 * @param {*} args
 * @returns
 */
function stringifyArguments(args) {
  return args.join(' ');
}

/**
 * Returns a string from an array of options.
 *
 * @param {array} options
 * @returns
 */
function stringifyOptions(options) {
  return Object.keys(options).map(option => {
    let output = `--${option}`;

    if (options[option] === true) {
      return output;
    }

    if (options[option] === false) {
      return '';
    }

    if (typeof options[option] === 'string') {
      output += `="${options[option]}"`;
    }
    else {
      output += `=${options[option]}`
    }

    return output;
  }).join(' ')
}

/**
 * Check does user exist.
 *
 * @param {string} username
 *   The username to check.
 * @returns
 *   True if the user exists, false otherwise.
 */
Cypress.Commands.add('userExists', (username) => {
  return cy.drush(`uinf `, [username], { failOnNonZeroExit: false }).then((result) => {
    return result.code === 0;
  });
});

/**
 * Basic user login command. Requires valid username and password.
 *
 * @param {string} username
 *   The username as which to log in.
 * @param {string} password
 *   The password for the user's account.
 */
Cypress.Commands.add('loginByNameAndPass', (username, password) => {
  cy.logout();

  cy.visit('/user/login')

  cy.get('#edit-name')
    .type(username)

  cy.get('#edit-pass').type(password, {
    log: false,
  });

  cy.get('#edit-submit').click();
});

/**
 * Logs out the user.
 */
Cypress.Commands.add('logout', () => {
  cy.visit('/user/logout');
})


/**
 * Creates a user account and assigns to it an array of roles.
 *
 * @param {string} username
 *   The username for the new account.
 * @param {array} roles
 *   An array of roles to be assigned to the new account.
 */
Cypress.Commands.add('createUserWithRole', (username, role) => {
  // Cancel the account with username, if it exists.
  cy.drush('user:cancel', ['--delete-content', username]);

  // Create the user account and assign to it the role
  return cy.drush('user:create', [username])
    .its('stderr')
    .should('match', /Created a new user/gm)
    .then(function (stderr) {
      const uid = stderr.match(/Created a new user with uid ([0-9]+)/)[1]

      cy.log(uid);

      cy.drush('user:role:add', [role, username])

      cy.wrap({
        username,
        uid,
      });
    });
});

/**
 * Logs a user in by their uid via drush uli.
 */
Cypress.Commands.add('loginByUid', (uid) => {
  cy.drush('user-login', [], { uid, uri: Cypress.env('baseUrl') })
    .its('stdout')
    .then(function (url) {
      cy.visit(url);
    });
});

/**
 * Logs a user in by their username via drush uli.
 */
Cypress.Commands.add('loginByName', (username) => {
  cy.drush('user-login', ['--name=' + username, '--uri=' + `${Cypress.env('baseUrl')}`])
    .its('stdout')
    .then(function (url) {
      cy.visit(url);
    });
});

/**
 * Adds text content in ckeditor.
 */
Cypress.Commands.add("typeCkeditor", (text) => {
  cy.get('.ck-content[contenteditable=true]').then(el => {
    // @ts-ignore
    const editor = el[0].ckeditorInstance  // If you're using TS, this is ReturnType<typeof InlineEditor['create']>
    editor.setData(text)
  })
});
