/// <reference types="cypress" />

describe('Doctors CRUD E2E Test', () => {
  beforeEach(() => {
    cy.loginAsPatient();
    cy.visit('/user/dashboard/doctors');
  });

  it('Should search a doctor by name and specialization', () => {
    // Wait for doctors to load
    cy.get('[data-test="doctor-card"]').should('exist');

    // Search by doctor name (partial match)
    cy.get('[data-test="search-doctor-input"]').type('Dennis');
    cy.get('[data-test="doctor-name"]').each((doctorname) => {
      //cy.wrap(doctorname): Wraps the raw DOM element so you can use Cypress commands on it.
      //.invoke('text'): Extracts the visible text content of the element.
      cy.wrap(doctorname)
        .invoke('text')
        .should('match', /Dennis/i);
    });

    // Clear the input
    cy.get('[data-test="search-doctor-input"]').clear();

    // Filter by specialization
    cy.get('[data-test="specialization-filter"]').select('Cardiologist');
    cy.get('[data-test="doctor-card"]').each((doctorcard) => {
      cy.wrap(doctorcard).contains('Cardiologist');
    });

    // Clear filters
    cy.get('[data-test="specialization-filter"]').select('All Specializations');

    // Confirm all doctors are back
    cy.get('[data-test="doctor-card"]').its('length').should('be.gte', 1);
  });

  it('Should show clear filters button when incorrect search is entered and reset on click', () => {
    // Type a non-matching search term
    cy.get('[data-test="search-doctor-input"]').type('Zzzzxyz');

    // Should show "No doctors found" message
    cy.contains('No doctors found').should('exist');

    // Clear Filters button should now be visible
    cy.get('[data-test="clear-filters-btn"]').should('exist').click();

    // Verify doctor list reappears
    cy.get('[data-test="doctor-card"]').should('exist');
    //.gte means greater than or equal to 1.
    cy.get('[data-test="doctor-card"]').its('length').should('be.gte', 1);
  });
});
