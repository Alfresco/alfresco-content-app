import { random } from '../support/utils/random';
import People from '../support/api/people.api';

describe('Logout', () => {
    const johnDoe = `user-${random()}`;

    before(() => {
        People.createUser(johnDoe);
    })

    beforeEach(() => {
        cy.login(johnDoe);

    });

    it('Sign out option is available [C213143]', () => {
        cy
            .get('.current-user__avatar')
            .click();

        cy.get('.mat-menu-panel').should('be.visible')
            .within(($panel) => {
                cy
                    .get('button')
                    .should('be.visible')
                    .and('contain', 'Sign out');
            });
    });
});
