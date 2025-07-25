describe("signup form tests", () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it("should signup with valid credentials", () => {
        // Mock the signup API call with a successful response
        cy.intercept('POST', '/auth/register', {
            statusCode: 201, //When the app sends a POST request to /auth/register, don't let it actually hit the backend."
                             //Instead, return a fake successful response (201 Created) with a fake user.


            body: {
                message: 'Registration successful! Please check your email to verify your account.',
                user: {
                    id: 123,
                    firstName: 'Admin',
                    lastName: 'Tester',
                    email: 'kansy841@gmail.com',
                    contactPhone: '0790519306',
                    address: 'P.O Box 1126-10100 Nyeri, Kenya',
                    role: 'admin',
                    isVerified: true
                }
            }
        }).as('signup');

        // Fill the form using data-test attributes
        cy.getDataTest('signup-firstname').as('firstNameInput')
        cy.get('@firstNameInput')
            .type('Admin')

        cy.getDataTest('signup-lastname').as('lastNameInput')
        cy.get('@lastNameInput')
            .type('Tester')

        cy.getDataTest('signup-email').as('emailInput')
        cy.get('@emailInput')
            .should('have.attr', 'type', 'email')
            .type('kansy841@gmail.com')

        cy.getDataTest('signup-phone').as('phoneNumberInput')
        cy.get('@phoneNumberInput')
            .should('have.attr', 'type', 'tel')
            .type('0790519306')

        cy.getDataTest('signup-address').as('addressInput')
        cy.get('@addressInput')
            .should('have.attr', 'type', 'text')
            .type('P.O Box 1126-10100 Nyeri, Kenya')

        cy.getDataTest('signup-password').as('passwordInput')
        cy.get('@passwordInput')
            .should('have.attr', 'type', 'password')
            .type('pass123');

        cy.getDataTest('signup-confirmpassword').as('confirmPasswordInput')
        cy.get('@confirmPasswordInput')
            .should('have.attr', 'type', 'password')
            .type('pass123');

        // Submit the form
        cy.getDataTest('signup-submitbtn').as('submitButton')
        cy.get('@submitButton')
            .should('contain.text', 'Create Account')
            .should('not.be.disabled')
            .click()

        // Wait for the mocked signup API call
        cy.wait('@signup')
            .then((interception) => {
                expect(interception.response.statusCode).to.eq(201);
                // Verify the request body contains the expected data
                expect(interception.request.body).to.deep.include({
                    firstName: 'Admin',
                    lastName: 'Tester',
                    email: 'kansy841@gmail.com',
                    contactPhone: '0790519306',
                    address: 'P.O Box 1126-10100 Nyeri, Kenya',
                    password: 'pass123',
                    confirmPassword: 'pass123'
                });
            });

        // Assert success toast
        cy.contains(/Registration successful/i, { timeout: 10000 }) //Cypress now checks the page DOM 

        // Should redirect to verification page
        cy.url().should('include', '/register/verify')
    });

    it("should show validation errors for empty fields", () => {
        cy.getDataTest('signup-submitbtn').as('submitButton')
        cy.get('@submitButton')
            .should('contain.text', 'Create Account')
            .click()

        cy.contains(/First name is required/i);
        cy.contains(/Last name is required/i);
        cy.contains(/Email is required/i);
        cy.contains(/Phone number is required/i);
        cy.contains(/Address is required/i);
        cy.contains(/Min 6 characters/i);
        cy.contains(/Confirm password is required/i)
    });

    it("should show error if passwords do not match", () => {
        cy.getDataTest('signup-firstname').as('firstNameInput')
        cy.get('@firstNameInput').type('Admin');

        cy.getDataTest('signup-lastname').as('lastNameInput')
        cy.get('@lastNameInput').type('Tester');

        cy.getDataTest('signup-email').as('emailInput')
        cy.get('@emailInput').type('kansy841@gmail.com');

        cy.getDataTest('signup-phone').as('phoneNumberInput')
        cy.get('@phoneNumberInput').type('0790519306');

        cy.getDataTest('signup-address').as('addressInput')
        cy.get('@addressInput').type('P.O Box 1126-10100 Nyeri, Kenya');

        cy.getDataTest('signup-password').as('passwordInput')
        cy.get('@passwordInput').type('pass123');

        cy.getDataTest('signup-confirmpassword').as('confirmPasswordInput')
        cy.get('@confirmPasswordInput').type('differentpass')

        cy.getDataTest('signup-submitbtn').as('submitButton')
        cy.get('@submitButton')
            .should('contain.text', 'Create Account')
            .click()

        cy.contains(/Passwords must match/i)
    });

});