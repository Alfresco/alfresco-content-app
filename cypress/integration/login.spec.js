import { APP_ROUTES } from '../app.config';
import { random } from '../support/utils/random';
import People from '../support/api/people.api';

describe('Login', () => {
    const testUser = `user-${random()}@alfness`;
    const russianUser = {
        username: `пользвате${random()}`,
        password: '密碼中國'
    };
    const johnDoe = {
        username: `user-${random()}`,
        get password() { return this.username; },
        firstName: 'John',
        lastName: 'Doe'
    };
    const disabledUser = `user-${random()}`;

    const testUser2 = {
        username: `user-${random()}`,
        password: 'user2 password'
    };
    const newPassword = 'new password';


    before(() => {
        People.createUser(testUser);
        People.createUser(russianUser.username, russianUser.password);
        People.createUser(johnDoe.username, johnDoe.password, {
            firstName: johnDoe.firstName,
            lastName: johnDoe.lastName
        });

        People.createUser(disabledUser);
        People.disableUser(disabledUser);
        People.createUser(testUser2.username, testUser2.password);
    });

    beforeEach(() => {
        cy.visit('/login');
    });

    describe('general tests', () => {
        beforeEach(() => {
            cy.get('#password')
                .as('passwordInput')
                .parentsUntil('.adf-login__field')
                .as('passwordField')
        });

        it('login page default values', () => {
            cy.get('#username').should('to.be.enabled');

            cy
                .get('@passwordInput')
                .should('to.be.enabled')
                .and('have.attr', 'type', 'password');

            cy.get('#login-button').should('to.be.disabled');
        });

        it('change password visibility', () => {
            cy.get('@passwordField').within(($passwordField) => {
                cy
                    .get('#password')
                    .type('some-password')
                    .should('have.attr', 'type', 'password');

                cy
                    .get('.adf-login-password-icon')
                    .click();

                cy
                    .get('#password')
                    .should('have.attr', 'type', 'text');
            });
        });
    });

    describe('with valid credentials', () => {
        it('navigate to "Personal Files"', () => {
            const { username } = johnDoe;

            cy.login(username);

            cy.url().should('include', '#/personal-files');
        });

        it(`displays user's name in header`, () => {
            const { username, firstName, lastName } = johnDoe;

            cy.login(username);

            cy.get('.current-user__full-name').should('contain', `${firstName} ${lastName}`);
        });

        it(`logs in with user having username containing "@"`, () => {
            cy.login(testUser);

            cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
        });

        it('logs in with user with non-latin characters', () => {
            const { username, password } = russianUser;

            cy.login(username, password);

            cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
        });

        it('redirects to Home Page when navigating to the Login page while already logged in', () => {
            const { username } = johnDoe;

            cy.login(username);

            cy.visit(APP_ROUTES.LOGIN);

            cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);

        });

        it('redirects to Personal Files when pressing browser Back while already logged in ', () => {
            const { username } = johnDoe;

            cy.login(username);

            cy.go('back');

            cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
        });

        describe('change password', () => {
            it('user logins with current password', () => {
                cy.login(testUser2.username, testUser2.password);
                cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
            });

            it('user is able to login after changing his password', () => {
                People.changePassword(testUser2.username, newPassword)
                cy.login(testUser2.username, newPassword)
                cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
            });
        });
    });

    describe('with invalid credentials', () => {

        it('disabled submit button when password is empty', () => {
            cy.get('#username').type('any-username');
            cy.get('#login-button').should('to.be.disabled');
        });

        it('disabled submit button when username is empty', () => {
            cy.get('#password').type('any-password');
            cy.get('#login-button').should('to.be.disabled');
        });

        it('shows error when entering nonexistent user', () => {
            cy.login('nonexistent-user', 'any-password');

            cy.url().should('contain', APP_ROUTES.LOGIN);
            cy.get('.login-error-message')
                .should('be.visible')
                .and('contain', `You've entered an unknown username or password`);
        });

        it('shows error when entering invalid password', () => {
            const { username } = johnDoe;

            cy.login(username, 'incorrect-password');

            cy.url().should('contain', APP_ROUTES.LOGIN);
            cy.get('.login-error-message')
                .should('be.visible')
                .and('contain', `You've entered an unknown username or password`);
        });

        it('unauthenticated user is redirected to Login page', () => {
            cy.visit(APP_ROUTES.PERSONAL_FILES);
            cy.url().should('contain', APP_ROUTES.LOGIN);
        });

        it('disabled user is not logged in', () => {
            cy.login(disabledUser);

            cy.url().should('contain', APP_ROUTES.LOGIN);
            cy.get('.login-error-message')
                .should('be.visible')
                .and('contain', `You've entered an unknown username or password`);
        });
    });
});
