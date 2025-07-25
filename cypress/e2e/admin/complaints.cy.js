/// <reference types="cypress" />

describe('Complaints CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); 
    cy.visit('/admin/dashboard/complaints'); 
  });

  it('should change status, update, and delete a complaint via the UI', () => {
    // Wait for data to load
    cy.contains('Complaints Management').should('be.visible');

    // Get the first complaint card
    cy.get('[data-test^="complaint-card-"]').first().as('firstComplaint');

    // === Change Status ===
    //^ means select elements where the attribute starts with this value.
    cy.get('@firstComplaint').find('[data-test^="change-status-"]').click();
    cy.get('[data-test="status-dropdown"]').select('Resolved');
    cy.get('[data-test="submit-status-change"]').click();

    // === Edit Complaint ===
    cy.get('@firstComplaint').find('[data-test^="edit-complaint-"]').click();
    cy.get('[data-test="update-subject-input"]').clear().type('Updated Subject via Cypress');
    cy.get('[data-test="update-description-textarea"]').clear().type('Updated Description via Cypress');
    cy.get('[data-test="submit-update-btn"]').click();

    // === Delete Complaint ===
    cy.intercept('DELETE', '/complaint/*', {
    statusCode: 200,
    body: { message: 'Mocked delete success' }
     }).as('deleteComplaint');

    cy.get('@firstComplaint').find('[data-test^="delete-complaint-"]').click();
    cy.get('[data-test="confirm-delete-btn"]').click();

    cy.wait('@deleteComplaint');

    cy.contains('Complaint deleted successfully!').should('exist');
  });
});
