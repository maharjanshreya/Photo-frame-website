import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {Login} from '../LoginRegister/Login';

describe('Login component', () => {
  it('should render login form', async () => {
    // Render the component
    const { getByPlaceholderText, getByText } = render(<Login />);

    // Find input fields and submit button
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Login');

    // Fill in the form inputs
    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for async tasks (e.g., API calls) to complete
    await waitFor(() => {
      // Assert that the user is redirected after successful login
      expect(window.location.pathname).toBe('/adminDashboard');
    });
  });

  it('should display error message on invalid login', async () => {
    // Mock fetch function to simulate failed login
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid email or password' }),
    });

    // Render the component
    const { getByPlaceholderText, getByText } = render(<Login />);

    // Find input fields and submit button
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Login');

    // Fill in the form inputs
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for async tasks (e.g., API calls) to complete
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
