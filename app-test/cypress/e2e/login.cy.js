beforeEach(() => {
  cy.seedDB();
});

describe('users', () => {
  it('can log in from the user menu on the app bar', () => {
    cy.visit('/');
    cy.get('[data-testid="guestUserIcon"]').click();
    cy.get('[data-testid="userMenuLogin"]').click();
    cy.get('[data-testid="username').clear().type('don');
    cy.get('[data-testid="password').clear().type('pwd');
    cy.get('[data-testid="submit"]').click();
    cy.get('[data-testid="accountUserIcon"]').click();
    cy.get('[data-testid="userMenuLogout"]').click();
    cy.get('[data-testid="guestUserIcon"]').should('be.visible');
  });
});

describe('visitors', () => {
  it('can register as a new user, log in and log out', () => {
    cy.visit('/');
    cy.get('[data-testid="guestUserIcon"]').click();
    cy.get('[data-testid="userMenuRegister"]').click();
    cy.get('[data-testid="username"]').clear().type('roger');
    cy.get('[data-testid="email"]').clear().type('roger@scpd.com');
    cy.get('[data-testid="password"]').clear().type('pwd');
    cy.get('[data-testid="passwordRepeat"]').clear().type('pwd');
    cy.get('[data-testid="submit').click();
    cy.get('[data-testid="guestUserIcon"]').click();
    cy.get('[data-testid="userMenuLogin"]').click();
    cy.get('[data-testid="username').clear().type('roger');
    cy.get('[data-testid="password').clear().type('pwd');
    cy.get('[data-testid="submit"]').click();
    cy.get('[data-testid="accountUserIcon"]').click();
    cy.get('[data-testid="userMenuLogout"').click();
    cy.get('[data-testid="guestUserIcon"]').should('be.visible');
  });
});
