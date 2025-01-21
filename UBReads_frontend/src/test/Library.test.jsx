import React from 'react';
import { Library } from '../components/views/Library';
import { render, screen } from '@testing-library/react';

/**
 * Test to see if the book contains the minimum required elements
 */
test('Library basic requirements', () => {
  
  // Render the component to test it
  render(<Library></Library>);

  // Looks for elements in the component
  const rating = screen.queryByText('0'); //Se queda.
  //const addButton = screen.queryByText('Afegir');
  //const image = screen.queryByAltText('Book Cover');
  //const author = screen.queryByText('Robert C. Martin');
  //const title = screen.queryByText('Clean Code: A Handbook of Agile Software Craftsmanship');
  const title = screen.queryByText('0');

  // Check if the elements are in the component
  expect(title).toBeInTheDocument();
  expect(image).toBeInTheDocument();
  expect(rating).toBeInTheDocument();
  expect(author).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();

  // Check if the elements are of the correct type
  expect(title.tagName).toBe('H1');
  expect(author.tagName).toBe('H2');
  expect(image.tagName).toBe('IMG');
  expect(rating.tagName).toBe('DIV');
  expect(addButton.tagName).toBe('BUTTON');
});