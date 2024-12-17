describe('Login Flow', () => {
    beforeEach(() => {
      // Visit the login page
      cy.visit('http://localhost:5173/'); // Update with your correct login page URL
    });
  
    it('should display the login form correctly', () => {
      // Verify the login form elements are visible
      cy.get('form').should('be.visible');
      cy.get('input[id="username"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    it('should login successfully with valid credentials', () => {
      // Mock the login API response (successful login)
      cy.intercept('POST', '/token', {
        statusCode: 200,
        body: { access_token: 'fakeAccessToken' },
      }).as('loginRequest');
  
      // Fill in valid credentials
      cy.get('input[id="username"]').type('validUsername');
      cy.get('input[id="password"]').type('ValidPassword123!');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and verify the response
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  
      // Verify that the token is stored in localStorage
      cy.window().then((window) => {
        const token = window.localStorage.getItem('access_token');
        expect(token).to.equal('fakeAccessToken');
      });
  
      // Verify the redirection to the home page
      cy.url().should('include', '/home');
    });
  
    it('should show an error for invalid credentials', () => {
      // Mock the login API response (failed login)
      cy.intercept('POST', '/token', {
        statusCode: 400,
        body: { message: 'Invalid credentials' },
      }).as('loginRequestFailed');
  
      // Fill in invalid credentials
      cy.get('input[id="username"]').type('invalidUsername');
      cy.get('input[id="password"]').type('WrongPassword123!');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and verify the response
      cy.wait('@loginRequestFailed').its('response.statusCode').should('eq', 400);
  
      // Assert that the error alert is shown (or any other error handling mechanism)
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Credencials invàlides');
      });
    });
  
    it('should navigate to the signup page when clicking the "Register" link', () => {
      // Click on the "Register" link to navigate to the signup page
      cy.get('a').contains('Registra\'t aquí').click();
  
      // Verify the redirection to the signup page
      cy.url().should('include', '/signup');
    });
  });
  