let drupal_core = '10.2.2';
let php_version = '8.2.18';

describe('Check the site stats.', () => {
  beforeEach(() => {
    cy.loginByUid('1');
    cy.visit('/admin/reports/status')
  })

  it(`Drupal core is ${drupal_core}`, () => {
    cy.get('.system-status-general-info__item-details')
      .contains(drupal_core)
  })

  it(`PHP version is ${php_version}`, () => {
    cy.get('.system-status-general-info__item-details')
      .contains(php_version)
  })

  it(`Site has no errors/warnings.`, () => {

    cy.get('details summary#error')
      .should('not.exist')
  })
})
