describe('users', () => {
  it('can log in from the user menu on the app bar', () => {
    cy.visit('/')
    cy.get('[data-testid="guestUserIcon"]').click()
    cy.get('[data-testid="userMenuLogin"]').click()
    cy.get('[data-testid="userName').clear().type('don')
    cy.get('[data-testid="password').clear().type('pwd')
    cy.get('[data-testid="submitLogin').click()
    cy.get('[data-testid="accountUserIcon"]').should('be.visible')
  })
  
})

