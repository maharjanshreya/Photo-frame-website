import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { SearchProvider } from './context/search';
test('renders learn react link', () => {
  render(
    <SearchProvider>
      <App />
    </SearchProvider>
  );
  
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
