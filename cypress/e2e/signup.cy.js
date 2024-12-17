describe('Signup Flow', () => {
  beforeEach(() => {
    // Visit the signup page
    cy.visit('http://localhost:5173/signup');
  });

  it('should display the signup form correctly', () => {
    // Verifica que los elementos del formulario sean visibles
    cy.get('form').should('be.visible');
    cy.get('input[id="username"]').should('be.visible');
    cy.get('input[id="email"]').should('be.visible');
    cy.get('input[id="password"]').should('be.visible');
    cy.get('input[id="password2"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should successfully sign up a user with valid details', () => {
    // Llenamos los detalles del formulario con datos válidos
    const username = 'testuser';
    const email = 'testuser@example.com';
    const password = 'Password123!';
    const selectedProfilePic = 'foto1';

    cy.get('input[id="username"]').type(username);
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('input[id="password2"]').type(password);

    // Simula seleccionar una foto de perfil
    cy.get('.profile-pic-box').first().click();

    // Envia el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que la solicitud POST al backend se haya realizado correctamente
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/users/', // Try using 127.0.0.1
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123!',
        profile_pic: 'foto1',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false, // Para que no falle si hay un error (si quieres manejarlo)
    }).then((response) => {
      // Verifica que el servidor responda con un código 201 (creado correctamente)
      expect(response.status).to.eq(200);
      // Verifica que la respuesta contenga un mensaje adecuado o el usuario haya sido creado

    });
    
  });

  it('should show an error if passwords do not match', () => {
    // Llenamos el formulario con contraseñas que no coinciden
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="email"]').type('testuser@example.com');
    cy.get('input[id="password"]').type('Password123!');
    cy.get('input[id="password2"]').type('Password321!');
    cy.get('.profile-pic-box').first().click();

    // Envia el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que el mensaje de error por contraseñas no coincidentes aparezca
    cy.contains('Les contrasenyes no coincideixen.').should('be.visible');
  });

  it('should show error if user already exists', () => {
    // Llenamos los detalles del formulario con datos válidos
    const username = 'testuser';
    const email = 'testuser@example.com';
    const password = 'Password123!';
    const selectedProfilePic = 'foto1';

    cy.get('input[id="username"]').type(username);
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('input[id="password2"]').type(password);

    // Simula seleccionar una foto de perfil
    cy.get('.profile-pic-box').first().click();

    // Envia el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que la solicitud POST al backend se haya realizado correctamente
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/users/', // Try using 127.0.0.1
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Password123!',
        profile_pic: 'foto1',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false, // Para que no falle si hay un error (si quieres manejarlo)
    }).then((response) => {
      // Verifica que el servidor responda con un código 201 (creado correctamente)
      expect(response.status).to.eq(400);
      // Verifica que la respuesta contenga un mensaje adecuado o el usuario haya sido creado

    });
    
  });

  it('should show an error if the email format is invalid', () => {
    // Llenamos el formulario con un correo electrónico inválido
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="email"]').type('invalid@email');
    cy.get('input[id="password"]').type('Password123!');
    cy.get('input[id="password2"]').type('Password123!');
    cy.get('.profile-pic-box').first().click();

    // Envia el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que el mensaje de error por formato de correo inválido aparezca
    cy.contains('El format del correu electrònic no és vàlid.').should('be.visible');
  });

  it('should show an error if no profile picture is selected', () => {
    // Llenamos el formulario sin seleccionar una foto de perfil
    cy.get('input[id="username"]').type('testuser');
    cy.get('input[id="email"]').type('testuser@example.com');
    cy.get('input[id="password"]').type('Password123!');
    cy.get('input[id="password2"]').type('Password123!');
  
    // Envia el formulario
    cy.get('button[type="submit"]').click();

    // Verifica que el mensaje de error por no seleccionar foto de perfil aparezca
    cy.contains('Has de seleccionar una foto de perfil.').should('be.visible');
  });
});
