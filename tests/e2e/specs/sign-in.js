describe('sign-in', () => {
  beforeEach(() => {
    cy.visit('/#/sign-in')
  })

  it('has a login heading', () => {
    cy.get('h1').should('contain.text', 'Sign In')
  })

  it('can sign in and sign out', () => {
    cy.get('input[name=email]').type(Cypress.env('HFTD_USER_EMAIL'))
    cy.get('input[name=password]').type(Cypress.env('HFTD_USER_PASSWORD'))
    cy.get('button[type=submit]').click()
    cy.url().should('match', /\/#\/$/)

    cy.visit('/#/settings')
    cy.get('h1').should('contain.text', 'Settings')
    cy.contains('Sign out').click()

    cy.url().should('contain', '#/sign-in')
    cy.get('h1').should('contain.text', 'Sign In')
  })
})