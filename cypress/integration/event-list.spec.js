/// <reference types="Cypress" />

beforeEach(() => {
  cy.viewport(640, 480);
  cy.visit('/');
});

describe('Event list', () => {
  it('Should exist in the DOM', () => {
    cy.get('#event-list').should('exist');
  });

  it('Should display atleast one event', () => {
    cy.get('#event-list')
      .find('.rsvp-event')
      .should('have.length.greaterThan', 0);
  });
});
