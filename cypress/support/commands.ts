/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
  return cy.get(`[data-test="${dataTestSelector}"]`);
});

//login Admin user
Cypress.Commands.add('loginAsAdmin', (email = 'suzzannekans@gmail.com', password = 'pass123') => {
  cy.visit('/login');
  cy.getDataTest('login-email-input').type(email);
  cy.getDataTest('login-password-input').type(password);
  cy.getDataTest('login-submit-button').click();
  cy.url().should('include', '/admin/dashboard/users').as('adminDashboardUrl');
  // Welcome to your Admin dashboard - contains
  cy.get('body').should('contain.text', 'Welcome to your Admin dashboard'); //body is the root element of the page
});

//login Doctor
Cypress.Commands.add('loginAsDoctor', (email = 'daisynmunga@gmail.com', password = 'pass123') => {
  cy.visit('/login');
  cy.getDataTest('login-email-input').type(email);
  cy.getDataTest('login-password-input').type(password);
  cy.getDataTest('login-submit-button').click();
  cy.url().should('include', '/doctor/dashboard/appointments').as('doctorDashboardUrl');
  cy.get('body').should('contain.text', 'Welcome to your Doctor dashboard');
});

//login Patient
Cypress.Commands.add(
  'loginAsPatient',
  (email = 'naamanomare99@gmail.com', password = 'pass123') => {
    cy.visit('/login');
    cy.getDataTest('login-email-input').type(email);
    cy.getDataTest('login-password-input').type(password);
    cy.getDataTest('login-submit-button').click();
    cy.url().should('include', '/user/dashboard/appointments').as('patientDashboardUrl');
    cy.get('body').should('contain.text', 'Welcome to your Patient dashboard');
  }
);

/* eslint-disable @typescript-eslint/no-namespace */
export {}; // means this file is a module, so we can augment the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      //means we are extending the Cypress namespace with our own custom commands
      getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
      loginAsAdmin(email?: string, password?: string): Chainable<void>;
      loginAsDoctor(email?: string, password?: string): Chainable<void>;
      loginAsPatient(email?: string, password?: string): Chainable<void>;
    }
  }
}
