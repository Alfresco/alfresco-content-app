describe('Login', function() {

    it('logs in as an admin', () => {
        cy.visit('http://localhost:4200/#/login');
        cy
            .get('#username')
            .type('admin')
            .should('have.value', 'admin');
        cy
            .get('#password')
            .type('admin')
            .should('have.value', 'admin');

        cy.get('#login-button').click();
        cy.url().should('include', '#/personal-files');
    });
});
