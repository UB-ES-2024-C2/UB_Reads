import React from 'react';
import { Book } from '../components/views/Book';
import { render, screen } from '@testing-library/react';

/**
 * Test to see if the book contains the minimum required elements
 */
test('Book basic requirements', () => {
  
  // Render the component to test it
  render(<Book bookId={1}></Book>);

  // Looks for elements in the component
  const rating = screen.queryByText('0');
  const addButton = screen.queryByText('Afegir');
  const image = screen.queryByAltText('Book Cover');
  const author = screen.queryByText('Robert C. Martin');
  const title = screen.queryByText('Clean Code: A Handbook of Agile Software Craftsmanship');

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