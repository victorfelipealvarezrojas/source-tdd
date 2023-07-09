import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const elemet = screen.getByText(/Sign Up/i);
  expect(elemet).toBeInTheDocument();
});
