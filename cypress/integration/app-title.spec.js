/// <reference types="Cypress" />

before(() => cy.visit('/'));

describe('App title heading', () => {
  it('Should display a text of Bitrock DVS', () => {
    cy.get('#app-title').should('contain', 'Bitrock DVS');
  });
});
