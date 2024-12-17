describe('Login Flow', () => {
  const validUsername = 'validUsername';
  const validPassword = 'ValidPassword123!';
  const invalidUsername = 'invalidUsername';
  const invalidPassword = 'WrongPassword123!';

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/users/', // Try using 127.0.0.1
      body: {
        username: 'validUsername',
        email: 'testuser2@example.com',
        password: 'ValidPassword123!',
        profile_pic: 'foto1',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false, // Para que no falle si hay un error (si quieres manejarlo)
    });
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
    // Fill in valid credentials
    cy.get('input[id="username"]').type(validUsername);
    cy.get('input[id="password"]').type(validPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/token', // Update with your API endpoint for login
      body: `username=${validUsername}&password=${validPassword}`, // Send data as URL-encoded string
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set content type as form-urlencoded
      },
      failOnStatusCode: false, // Handle failures manually
    }).then((response) => {
      // Verify that the response contains the access token
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access_token');

      // Store the token in localStorage
      cy.window().then((window) => {
        window.localStorage.setItem('access_token', response.body.access_token);
      });

    });
  });

  it('should show an error for invalid credentials', () => {
    // Fill in invalid credentials
    cy.get('input[id="username"]').type(invalidUsername);
    cy.get('input[id="password"]').type(invalidPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/token', // Update with your API endpoint for login
      body: `username=${invalidUsername}&password=${invalidPassword}`, // Send data as URL-encoded string
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set content type as form-urlencoded
      },
      failOnStatusCode: false, // Handle failures manually
    }).then((response) => {
      // Verify the response indicates an error (e.g., 400 Bad Request)
      expect(response.status).to.eq(400);

      // Assert that an alert or error message is shown
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Credencials invàlides'); // Update with actual alert message
      });
    });
  });

  it('should navigate to the signup page when clicking the "Register" link', () => {
    // Click on the "Register" link to navigate to the signup page
    cy.get('a').contains('Registra\'t aquí').click();

    // Verify the redirection to the signup page
    cy.url().should('include', '/signup');
  });
});
