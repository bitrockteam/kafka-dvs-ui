/// <reference types="Cypress" />

beforeEach(() => {
  cy.viewport(1920, 1080);
  cy.visit('/');
});

describe('World map', () => {
  it('Should exist in the DOM', () => {
    cy.get('.mapboxgl-canvas').should('exist');
  });

  it('Should display atleast one event marker', () => {
    cy.get('.mapboxgl-canvas-container')
      .find('.map-event')
      .should('have.length.greaterThan', 0);
  });

  it('Event marker should display a popup when clicked', () => {
    cy.get('.map-event').click({ multiple: true });
    cy.get('.mapboxgl-popup').should('exist');
  });
});
