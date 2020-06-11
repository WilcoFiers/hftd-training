describe('layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows the sidebar in a wide screen', () => {
    cy.viewport(1280, 960)
    cy.get('nav').should('be.visible')
  })

  it('shows the sidebar in a wide screen', () => {
    cy.viewport(1024, 768)
    cy.get('nav').should('not.be.visible')
  })
})
