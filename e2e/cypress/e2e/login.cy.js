describe('pages can be loaded', () => {
  it('loads front page', () => {
    cy.visit('/')
    cy.contains('Hello')
  })

  it('loads register page', () => {
    cy.visit('/register')
    cy.contains('world')
  })
})