import dayjs from 'dayjs';
/// <reference types="cypress" />

describe('Appointments CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsDoctor();
    cy.visit('/doctor/dashboard/appointments');
  });

  it('Should change status and update an appointment via the UI', () => {
    // Wait for data to load
    cy.get('[data-test="change-status-button"]').first().click();

    // Change status
    cy.get('[data-test="status-select"]').select('Confirmed');
    cy.get('[data-test="status-submit-button"]').click();

    // Wait for modal to close and toast to appear
    cy.contains('Appointment status updated successfully!').should('be.visible');

    // Edit appointment
    cy.get('[data-test="edit-appointment-button"]').first().click();

    const newDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

    cy.get('[data-test="appointment-date-input"]').clear().type(newDate);
    cy.get('[data-test="time-slot-select"]').select('10:00:00');
    cy.get('[data-test="appointment-status-select"]').select('Confirmed');
    cy.get('[data-test="total-amount-input"]').clear().type('7500');
    cy.get('[data-test="update-appointment-submit"]').click();

    // Check for success
    cy.contains('Appointment updated successfully!').should('be.visible');
  });
});
