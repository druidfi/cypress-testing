describe('Check the site stats.', () => {
  beforeEach(() => {
    cy.loginByUid('1');
    cy.visit('/admin/reports/status')
  })

  // Check core and php versions set in fixtures/system.json.
    it('PHP version is correct.', () => {
      cy.fixture('system.json').then(system_info => {
        cy.get('.system-status-general-info__item-details')
          .contains(system_info.php_version)
      })
    })

    it('Drupal core is correct.', () => {
      cy.fixture('system.json').then(system_info => {
        cy.get('.system-status-general-info__item-details')
          .contains(system_info.drupal_core)
    })
  })


  it(`Site has no errors/warnings.`, () => {
    cy.get('details summary#error')
      .should('not.exist')
  })
})
