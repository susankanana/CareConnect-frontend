/// <reference types="cypress" />

describe('Prescriptions CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsDoctor();
    cy.visit('/doctor/dashboard/prescriptions');
  });

  it('Should perform all CRUD operations on a prescription via the UI', () => {
    // Create
    cy.get('[data-test="open-create-prescription"]').click();
    cy.get('[data-test="create-appointment-id"]').type('45');
    cy.get('[data-test="create-patient-id"]').type('418');
    cy.get('[data-test="create-notes"]').type('Take 1 tablet twice a day');
    cy.get('[data-test="create-amount"]').type('500');
    cy.get('[data-test="submit-create-prescription"]').click();
    cy.contains('Prescription created successfully!').should('exist');

    // Wait for prescription to show up
    cy.get('[data-test="prescription-card"]').first().as('latestPrescription');

    // Edit
    cy.get('@latestPrescription').find('[data-test="edit-prescription-button"]').click();
    cy.get('[data-test="update-notes"]').clear().type('Take 1 tablet once daily');
    cy.get('[data-test="update-amount"]').clear().type('600');
    cy.get('[data-test="submit-update-prescription"]').click();
    cy.contains('Prescription updated successfully!').should('exist');

    // Delete
    cy.get('@latestPrescription').find('[data-test="delete-prescription-button"]').click();
    cy.get('[data-test="confirm-delete-prescription"]').click();
    cy.contains('Prescription deleted successfully!').should('exist');
  });
});
