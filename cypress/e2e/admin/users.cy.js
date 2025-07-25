/// <reference types="cypress" />

describe('Users CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin(); 
    cy.visit('/admin/dashboard/users'); 
  });

  it('should change the role of a user via the UI', () => {
    // Wait for users to load and click "Change Role" on the first user card
    cy.get('button').contains('Change Role').first().click();

    // Assert modal opened
    cy.get('[data-test="change-role-modal-title"]').should('be.visible');

    // Change role selection
    cy.get('[data-test="role-select"]').select('admin');

    // Submit the form
    cy.get('[data-test="change-role-button"]').click();

    // Assert toast and modal closed
    cy.contains('Role updated successfully!').should('be.visible');
    cy.get('#role_modal').should('not.be.visible');
  });
});
