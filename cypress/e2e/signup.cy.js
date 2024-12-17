describe('Signup Flow', () => {
    beforeEach(() => {
      // Visit the signup page
      cy.visit('http://localhost:5173/signup'); // Update with the correct URL if necessary
    });
  
    it('should display the signup form correctly', () => {
      cy.get('form').should('be.visible');
      cy.get('input[id="username"]').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.get('input[id="password2"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    it('should successfully sign up a user with valid details', () => {
      // Intercept the POST request to mock backend response
      cy.intercept('POST', '/users/', {
        statusCode: 201,
        body: { message: 'User created successfully' },
      }).as('signupRequest');
  
      // Fill in valid form details
      cy.get('input[id="username"]').type('testuser');
      cy.get('input[id="email"]').type('testuser@example.com');
      cy.get('input[id="password"]').type('Password123!');
      cy.get('input[id="password2"]').type('Password123!');
      
      // Simulate selecting a profile picture
      cy.get('.profile-pic-box').first().click();
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock request and verify the success response
      cy.wait('@signupRequest').its('response.statusCode').should('eq', 201);
  
      // Assert that the user is redirected or the success message appears
      cy.url().should('include', '/'); // Adjust if the redirection URL is different
    });
  
    it('should show an error if passwords do not match', () => {
      // Fill in the form with mismatched passwords
      cy.get('input[id="username"]').type('testuser');
      cy.get('input[id="email"]').type('testuser@example.com');
      cy.get('input[id="password"]').type('Password123!');
      cy.get('input[id="password2"]').type('Password321!');
      cy.get('.profile-pic-box').first().click();
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the error message for password mismatch is visible
      cy.contains('Les contrasenyes no coincideixen.').should('be.visible');
    });

    it('should show an error if the email format is invalid', () => {
      // Fill in the form with an invalid email
      cy.get('input[id="username"]').type('testuser');
      cy.get('input[id="email"]').type('invalid@email');
      cy.get('input[id="password"]').type('Password123!');
      cy.get('input[id="password2"]').type('Password123!');
      cy.get('.profile-pic-box').first().click();
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the email error message is visible
      cy.contains('El format del correu electrònic no és vàlid.').should('be.visible');
    });
  
  
    it('should show an error if no profile picture is selected', () => {
      // Fill in the form without selecting a profile picture
      cy.get('input[id="username"]').type('testuser');
      cy.get('input[id="email"]').type('testuser@example.com');
      cy.get('input[id="password"]').type('Password123!');
      cy.get('input[id="password2"]').type('Password123!');
    
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that the profile picture error message is visible
      cy.contains('Has de seleccionar una foto de perfil.').should('be.visible');
    });
  });
  