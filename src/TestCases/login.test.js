// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import Login from "../LoginRegister/Login";
// import { BrowserRouter } from "react-router-dom";

// // Mock the react-router-dom module
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: jest.fn(), // Mock useNavigate
// }));

// // Mocking the fetch function
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ success: true }),
//     ok: true,
//   })
// );

// describe("Login component", () => {
//   it("submits email and password", async () => {
//     const email = "admin@gmail.com";
//     const password = "admin123";
//     const mockNavigate = jest.fn();
//     require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);

//     render(
//       <BrowserRouter> {/* Wrap the Login component with BrowserRouter */}
//         <Login />
//       </BrowserRouter>
//     );

//     userEvent.type(screen.getByPlaceholderText(/email/i), email);
//     userEvent.type(screen.getByPlaceholderText(/password/i), password);
//     userEvent.click(screen.getByRole("button", { name: /login/i }));

//     // Add some debug statements to understand the behavior
//     console.log("mockNavigate calls:", mockNavigate.mock.calls);
// // Add debug output to see if there are any errors during test execution
// console.log("Fetch calls:", fetch.mock.calls);
// console.log("Document body:", document.body.innerHTML);
//     // Wait for the API call to resolve
//     await waitFor(() => {
//       console.log("Fetch calls:", fetch.mock.calls);
//       console.log("Document body:", document.body.innerHTML);
//       expect(fetch).toHaveBeenCalledWith('/signin', {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });

//       // Add a debug statement to check the received arguments for mockNavigate
//       console.log("mockNavigate calls:", mockNavigate.mock.calls);

//       expect(mockNavigate).toHaveBeenCalledWith("/adminDashboard");
//     });
//   });
// });
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from "../LoginRegister/Login";

// Mock the navigate function
const mockNavigate = jest.fn();

HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  // Mock implementation, return whatever getContext needs to return
  return {};
});
// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true }),
});

test('Login component submits email and password and redirects to admin dashboard', async () => {
  // Render the Login component
  const { getByLabelText, getByText } = render(<Login navigate={mockNavigate} />); // Assuming you pass the navigate function as a prop

  // Fill out the form fields
  fireEvent.change(getByLabelText('email'), { target: { value: 'admin@gmail.com' } });
  fireEvent.change(getByLabelText('password'), { target: { value: 'admin123' } });

  // Click the login button
  fireEvent.click(getByText('Login'));

  // Wait for the login process to complete
  await waitFor(() => {
    // Check that the fetch function was called with the correct URL and options
    expect(fetch).toHaveBeenCalledWith('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' }),
    });
    // Check that the navigate function was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/adminDashboard');
  });
});
