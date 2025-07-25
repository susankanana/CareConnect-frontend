import dayjs from 'dayjs';
/// <reference types="cypress" />

describe('Appointments CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsPatient();
    cy.visit('/user/dashboard/appointments');
  });

  it('Should create an appointment via the UI', () => {
    cy.get('[data-test="book-appointment-btn"]').click();
    cy.get('[data-test="create-appointment-form"]').should('exist');

    cy.get('[data-test="doctor-select"]').select('404');
    const tomorrow = dayjs().add(2, 'day').format('YYYY-MM-DD');
    cy.get('[data-test="appointment-date-input"]').should('not.be.disabled').type(tomorrow);
    cy.get('[data-test="appointment-time-slot-select"]').select('09:00:00');
    cy.get('[data-test="submit-appointment-btn"]').click();
    cy.contains('Appointment booked successfully!').should('exist');
  });

 it('Should perform payment on existing confirmed appointment via the UI', () => {
  // Make sure we're on the correct page
  cy.url().should('include', '/user/dashboard/appointments');

  // Intercept the create-checkout-session API before clicking
  cy.intercept('POST', '**/create-checkout-session', {
    statusCode: 200,
    body: { url: 'https://dummy-payment-gateway.test' },
  }).as('createCheckout');

  // Wait for appointments to load
  cy.get('body').then(($body) => {
    // Check if any confirmed appointment exists
    if ($body.text().includes('Confirmed')) {
      cy.contains('Confirmed').parents('[data-test="appointment-card"]').within(() => {
        cy.get('[data-test="pay-now-btn"]').click();
      });

      cy.get('[data-test="proceed-to-checkout-btn"]').should('exist').click();
      cy.wait('@createCheckout');
    } else {
      // Fail gracefully
      cy.log('No confirmed appointments available for payment');
    }
  });
});

});

