/// <reference types="Cypress" />

before(() => cy.visit('/'));

describe('App title heading', () => {
  it('Should display a text of Kafka Geostream', () => {
    cy.get('#app-title').should('contain', 'Kafka Geostream');
  });
});
