import { render } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const appElement = document.getElementById('lac');
  expect(appElement).toBeInTheDocument();
});
