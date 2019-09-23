/// <reference types="Cypress" />

beforeEach(() => cy.visit('/'));

describe('List section', () => {
  it('Should have a list of countries', () => {
    cy.get('.list-section')
      .find('#country-list')
      .should('exist');
  });

  it('Country list should display a max of five countries', () => {
    cy.get('#country-list')
      .find('.country-data')
      .should('have.length.lessThan', 6);
  });

  it('Should have a list of topics', () => {
    cy.get('.list-section')
      .find('#topic-list')
      .should('exist');
  });

  it('Topic list should display a max of five topics', () => {
    cy.get('#topic-list')
      .find('.topic-data')
      .should('have.length.lessThan', 6);
  });
});
