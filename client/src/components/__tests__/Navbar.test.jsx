import React from 'react';
jest.mock('../../services/api', () => ({}));

import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';

test('renders RentSafi logo and navigation links', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  expect(screen.getByText(/RentSafi/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
}); 