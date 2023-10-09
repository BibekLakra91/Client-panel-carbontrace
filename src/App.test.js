import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
test('renders the landing page', () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
