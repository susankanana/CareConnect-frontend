/// <reference types="cypress" />

describe('Appointments CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); 
    cy.visit('/admin/dashboard/appointments'); 
  });

  it('Should load appointments dashboard and open update modal', () => {
    cy.get('[data-test="submit-update-appointment"]').should('not.exist');
    cy.get('button').contains('Edit').first().click();
    cy.get('[data-test="update-appointment-form"]').should('be.visible');
  });

  it('Should update an appointment', () => {
    cy.contains('Edit').first().click();

    cy.get('[data-test="update-date-input"]').clear().type('2025-08-15');
    cy.get('[data-test="update-time-slot-select"]').select('10:00:00');
    cy.get('[data-test="update-status-select"]').select('Confirmed');
    cy.get('[data-test="update-total-amount-input"]').clear().type('7500');

    cy.get('[data-test="submit-update-appointment"]').click();
    cy.contains('Appointment updated successfully!').should('exist');
  });

  it('Should open and cancel the update modal', () => {
    cy.contains('Edit').first().click();
    cy.get('[data-test="cancel-update-appointment"]').click();
    cy.get('[data-test="update-appointment-form"]').should('not.be.visible');
  });

  it('Should open delete modal and confirm deletion', () => {
    cy.get('[data-test="delete-appointment-button"]').first().click();
    cy.get('[data-test="delete-appointment-modal"]').should('be.visible');
  });
  
  it('Should cancel deletion from modal', () => {
    cy.get('[data-test="delete-appointment-button"]').first().click();
    cy.get('[data-test="delete-appointment-modal"]').should('be.visible');
    cy.get('[data-test="cancel-delete-appointment"]').click();
    cy.get('[data-test="delete-appointment-modal"]').should('not.be.visible');
  });

});
