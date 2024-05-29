describe('Load the front page.', () => {
  it('visit the front page.', () => {
    cy.visit('/');
  })
})

describe('Test permissions to view content listing.', () => {
  it('url admin/content prints Access denied when not logged in.', () => {
    cy.request({
      url: 'admin/content',
      followRedirect: false,
      failOnStatusCode: false
    })
      .then((resp) => {
        expect(resp.status).to.eq(403)
      })

  });

  it('url admin/content returns 200 when logged in as user id 1.', () => {
    cy.loginByUid('1');

    cy.request({
      url: 'admin/content',
      followRedirect: false,
      failOnStatusCode: false
    })
      .then((resp) => {
        expect(resp.status).to.eq(200)
      })
  })
})

describe('Testing user rights', () => {

  it('Login as test user and create content', () => {

    // Check if user exist.
    cy.fixture('test-user.json').then(user => {
      cy.userExists(user.name).then(result => {
        if (!result) {
          cy.log('Creating new user.');
          cy.createUserWithRole(user.name, user.role);
          cy.loginByName(user.name);
        }
        else {
          cy.log('User already exists');
          cy.loginByName(user.name);
        }
      })
    })

      // Edit node type.
      .then(() => {
        cy.fixture('content.json').then(content => {
          cy.visit(Cypress.config().baseUrl + 'node/add/' + content.node_type);
        })

        // Get all required fields.
        cy.get('.required').each((($element, $index, $list) => {

          if ($element[0].type === 'text') {
            cy.fixture('content.json').then(content => {
              cy.wrap($element).type(content.test_content + ' title')
            })
          }
          else if ($element[0].type === 'textarea') {
            cy.fixture('content.json').then(content => {
              cy.wrap($element).type(content.test_content)
            })
          }
          else if ($element[0].type === 'select-one') {
            cy.wrap($element).select(1, {force: true}).invoke('val')
          }
          else if ($element[0].type === 'number') {
            cy.wrap($element).type('1')
          }
          else if (!$element[0].type) {
            // No type typically means section for paragraph reference that requires opening an iframe modal.

            // Opens the iframe modal.
            cy.wrap($element)
              .within($element, () => {
                cy.get('.form-submit')
                  .click()
                  .wait(1000)
              })

            // Gets the iframe body.
            cy.get('iframe')
              .then(($iframe) => {
                const $body = $iframe.contents().find('body')

                // Gets the first checkbox.
                cy.wrap($body)
                  .find('input[type="checkbox"]')
                  .first()
                  .check({ force: true })

                cy.wrap($body)
                  .find('#edit-submit')
                  .click()
                  // Wait is needed to allow modal to close and save.
                  .wait(1000)
              })
          }

            cy.get('#edit-submit')
              .click()
              .then(() => {
                // Checks the alert if some required fields were missed.
                if (cy.get('div[role="alert"]')) {
                  cy.get('div.messages__content')
                    .then($alert => {
                      // Gets the name of the field that alert is about.
                      const $required_field = $alert.text().split(" field").shift().trim().toLowerCase();
                      cy.get('input[id^="field-' + $required_field + '-"')
                        .first()
                        .click()
                        .wait(1000)

                      cy.fixture('content.json').then(content => {
                        // Checks if there is a cke field.
                        if (cy.get('.ck-content[contenteditable=true]')) {
                          cy.typeCkeditor(content.test_content)
                        }
                      })

                      cy.get('#edit-submit')
                        .click()
                    })
                }
              })
        }))
      })
  })

  it('Content editor can delete their own content in bulk.', () => {
    // Check if user exist.
    cy.fixture('test-user.json').then(user => {
      cy.userExists(user.name).then(result => {
        if (!result) {
          cy.log('Creating new user.');
          cy.createUserWithRole(user.name, user.role);
          cy.loginByName(user.name);
        }
        else {
          cy.log('User already exists');
          cy.loginByName(user.name);
        }
      })

      cy.visit(Cypress.config().baseUrl + 'admin/content');

      cy.get('tbody tr').each(($el, $index, $list) => {
        // Checks if the content listing is not empty.
        if(!$el[0].classList.contains('odd')) {

          // Checks which content is authored by test user.
          cy.wrap($el.children('.views-field-uid'))
            .within(($cell) => {
              if ($cell[0].innerText === user.name) {
                cy.log('Found content authored by test user.');
                cy.wrap($el)
                  .within(() => {
                    cy.get('td .js-form-type-checkbox *[data-drupal-selector^="edit-node-bulk-form-"]').click();
                  });
              }
            })
        }
      })

        // Delete selected content in bulk.
        .then(() => {
          cy.get('select#edit-action')
            .select('node_delete_action')
          cy.get('input#edit-submit')
            .click()
          cy.get('input#edit-submit')
            .click()
        })
    })
  })
})
