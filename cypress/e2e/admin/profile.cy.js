/// <reference types="cypress" />

describe('Admin Profile Update E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard/profile');
  });

  it('should update the admin profile via the UI', () => {
    // Wait for profile data to load
    cy.contains('Admin:').should('exist');

    // Click "Update Profile"
    cy.get('[data-test="update-profile-btn"]').click();

    // Modal should be visible
    cy.get('[data-test="update-profile-modal"]').should('be.visible');

    // Fill in new profile info
    cy.get('[data-test="first-name-input"]').clear().type('TestFirst');
    cy.get('[data-test="last-name-input"]').clear().type('TestLast');
    cy.get('[data-test="image-url-input"]').clear().type('https://via.placeholder.com/150');

    // Submit the form
    cy.get('[data-test="confirm-update-btn"]').click();

    // Expect toast or success message
    cy.contains('Profile updated successfully!').should('exist');

    // Modal should close
    cy.get('[data-test="update-profile-modal"]').should('not.be.visible');

    // Updated name should be visible on the profile
    cy.contains('Admin: TestFirst TestLast').should('exist');
  });
});
