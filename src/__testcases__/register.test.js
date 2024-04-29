import React from 'react';
import { render, fireEvent, waitFor, screen ,act} from '@testing-library/react';
import Register from '../LoginRegister/Register';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';

// Set up fetch mocking
// fetchMock.enableMocks();
// fetchMock.mockOnce('/register', {
//     status: 200,
//     body: { message: 'Registration successfull' },
//   });
  
 
// test('registration form submission', async () => {
//   render( <BrowserRouter> {/* Wrap your component with BrowserRouter */}
//   <Register />
// </BrowserRouter>);

//   // Fill in the form fields
//   userEvent.type(screen.getByPlaceholderText('Firstname'), 'John');
//   userEvent.type(screen.getByPlaceholderText('Lastname'), 'Doe');
//   userEvent.type(screen.getByPlaceholderText('Username'), 'johndoe');
//   userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
//   userEvent.type(screen.getByPlaceholderText('Password'), 'password');
//   userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password');
//   userEvent.type(screen.getByPlaceholderText('Contact'), '1234567890');
//   // Submit the form
//   act(() => { // Wrap the code that triggers state updates or side effects inside act(...)
//     userEvent.click(screen.getByText('Register'));
//   });

//   // Wait for the registration process to complete
//   await waitFor(() => {
//     expect(screen.getByText('Registration successfull')).toBeInTheDocument();
//     expect(screen.getByText("Your registration is complete. You're now part of our community! Get ready to explore exciting features, exclusive offers, and engaging content.")).toBeInTheDocument();
//   });
// });


test("Testing Input Box",( )=>{
    render(
    <BrowserRouter>
    <Register/></BrowserRouter>);
    let checkInput = screen.getByPlaceholderText("Firstname");
    expect (checkInput).toBeInTheDocument();
});
test("On change event testing",( )=>{
    render(
    <BrowserRouter>
    <Register/></BrowserRouter>);
    let checkInput = screen.getByPlaceholderText("Firstname");
    fireEvent.change(checkInput,{target:{value:"John"}});
    expect (checkInput.value).toBe("John");
});
