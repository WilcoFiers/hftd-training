// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (userName, password) => {
  cy.visit('/#/sign-in')
  cy.get('input[name=email]').type(userName || Cypress.env('HFTD_USER_EMAIL'))
  cy.get('input[name=password]').type(password || Cypress.env('HFTD_USER_PASSWORD'))
  cy.get('button[type=submit]').click()
  cy.url().should('match', /\/#\/$/)
});
