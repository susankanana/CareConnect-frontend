/// <reference types="cypress" />

describe('Complaints CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsPatient(); 
    cy.visit('/user/dashboard/complaints');
  });

  it('Should create a complaint via the UI', () => {
    cy.get('[data-test="open-create-complaint-btn"]').click();

    cy.get('[data-test="complaint-subject-input"]').type('Delayed Appointment');
    cy.get('[data-test="complaint-description-input"]').type('My appointment started 45 minutes late and no explanation was provided.');
    cy.get('[data-test="complaint-appointment-id-input"]').type('33');

    cy.get('[data-test="complaint-submit-btn"]').click();

    // Toast check (if using `sonner`)
    cy.contains('Complaint submitted successfully').should('exist');

    // Wait for modal to close and data to reload
    cy.wait(1000);

    // Verify the complaint appears in the list
    cy.contains('Delayed Appointment').should('exist');
    cy.contains('Complaint #').should('exist');
  });
});
