import React from 'react';
import { Login } from '../login';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

/**
 * Test de ejemplo util para comprobar el estado de un componente de React
 */
test('Empty test example', async () => {

    // Reenderiza el componente para hacer el test sobre el DOM
    render(
    <BrowserRouter>
        <Login/>
    </BrowserRouter>
    );

    // Busca un elemento en el componente que contenga el texto 'Envia's
    const loginButton = screen.getByText('Envia');

    // Comprueba que existe un elemento con el texto 'Envia' y que sea de tipo button
    expect(loginButton).toBeInTheDocument();
    
    // Comprueba que el elemento sea un botón
    expect(loginButton.tagName).toBe('BUTTON');

    // Comprueba que el botón sea de tipo submit
    expect(loginButton).toHaveAttribute('type', 'submit');
})