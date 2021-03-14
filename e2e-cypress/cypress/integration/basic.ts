
describe('google search', () => {
  it('should work', () => {
    cy.visit('');
    cy.get('input#username').type(Cypress.env('admin_username'));
    cy.get('input#password').type(Cypress.env('admin_password'));
    cy.get('[type="submit"]').click();
    cy.url().should('contain', '/personal-files');
  });
});
