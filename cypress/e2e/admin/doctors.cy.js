// /// <reference types="cypress" />

// describe('Doctors CRUD E2E Test', () => {
//   beforeEach(() => {
//     cy.loginAsAdmin(); 
//     cy.visit('/admin/dashboard/doctors'); 
//   });

//   it('should insert and delete a doctor via the UI', () => {
//     const uniqueEmail = `doctor${Date.now()}@test.com`;

//     cy.get('[data-test="create-doctor-button"]').click();

//     cy.get('[data-test="doctor-firstname-input"]').type('Cypress');
//     cy.get('[data-test="doctor-lastname-input"]').type('Test');
//     cy.get('[data-test="doctor-email-input"]').type(uniqueEmail);
//     cy.get('[data-test="doctor-password-input"]').type('Password123!');
//     cy.get('[data-test="doctor-phone-input"]').type('+254700000001');
//     cy.get('[data-test="doctor-address-input"]').type('123 Test Street');
//     cy.get('[data-test="doctor-specialization-input"]').type('Testology');
//     cy.get('[data-test="doctor-availableday-monday"]').check();
//     cy.get('[data-test="create-doctor-submit-button"]').click();

//     cy.contains('Doctor added successfully').scrollIntoView().should('be.visible');
//     cy.contains(`Dr. Cypress Test`).should('be.visible');

//     cy.intercept('DELETE', '/user/*').as('deleteDoctor');

//     cy.contains('Dr. Cypress Test').parents('[class*="shadow-md"]').within(() => {
//       cy.get('button').contains('Delete').click();
//     });

//     cy.get('[data-test="delete-doctor-confirm-button"]').click();
//     cy.wait('@deleteDoctor');
//     cy.contains('Doctor deleted successfully').should('be.visible');
//   });
// });
/// <reference types="cypress" />

describe('Doctors CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); 
    cy.visit('/admin/dashboard/doctors'); 
  });

  it('should insert, update, and delete a doctor via the UI', () => {
    const uniqueEmail = `doctor${Date.now()}@test.com`;
    const updatedFirstName = 'UpdatedCypress';

    // CREATE DOCTOR
    cy.get('[data-test="create-doctor-button"]').click();
    cy.get('[data-test="doctor-firstname-input"]').type('Cypress');
    cy.get('[data-test="doctor-lastname-input"]').type('Test');
    cy.get('[data-test="doctor-email-input"]').type(uniqueEmail);
    cy.get('[data-test="doctor-password-input"]').type('Password123!');
    cy.get('[data-test="doctor-phone-input"]').type('+254700000001');
    cy.get('[data-test="doctor-address-input"]').type('123 Test Street');
    cy.get('[data-test="doctor-specialization-input"]').type('Testology');
    cy.get('[data-test="doctor-availableday-monday"]').check();
    cy.get('[data-test="create-doctor-submit-button"]').click();

    cy.contains('Doctor added successfully').should('be.visible');
    cy.contains(`Dr. Cypress Test`).should('be.visible');

    // UPDATE DOCTOR
    cy.contains(`Dr. Cypress Test`).parents('[class*="shadow-md"]').within(() => {
      cy.get('[data-test="edit-doctor-button"]').click();
    });

    cy.get('[data-test="update-doctor-firstname-input"]').clear().type(updatedFirstName);
    cy.get('[data-test="update-doctor-submit-button"]').click();
    cy.contains('Doctor updated successfully').should('be.visible');
    cy.contains(`Dr. ${updatedFirstName} Test`).should('be.visible');

    // DELETE DOCTOR
    cy.intercept('DELETE', '/user/*').as('deleteDoctor');

    cy.contains(`Dr. ${updatedFirstName} Test`).parents('[class*="shadow-md"]').within(() => {
      cy.get('button').contains('Delete').click();
    });

    cy.get('[data-test="delete-doctor-confirm-button"]').click();
    cy.wait('@deleteDoctor');
    cy.contains('Doctor deleted successfully').should('be.visible');
  });
});
