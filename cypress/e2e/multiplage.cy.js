describe("navigating the navigation bar", () => {
    beforeEach(() => {
        cy.visit('/');
        // Set viewport to desktop size to ensure desktop nav is visible
        cy.viewport(1280, 720);
    });

    it("should visit multiple pages", () => {
        // Verify we're on the home page
        cy.location("pathname").should("equal", "/");
        cy.getDataTest("careconnect-welcome-header").should("be.visible").should("contain.text", "Your Health is OurPriority");

        cy.getDataTest("desktop-nav-about").as("aboutLink");
        cy.get("@aboutLink").click();
        cy.location("pathname").should("equal", "/about");
        cy.contains("About CareConnect").should("be.visible");

        cy.getDataTest("desktop-nav-register").as("registerLink");
        cy.get("@registerLink").click();
        cy.location("pathname").should("equal", "/register");

        cy.visit('/');
        cy.getDataTest("desktop-nav-login").click();
        cy.location("pathname").should("equal", "/login");

    })


});