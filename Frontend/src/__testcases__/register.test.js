import React from 'react';
import { render, fireEvent, waitFor, screen ,act} from '@testing-library/react';
import Register from '../LoginRegister/Register';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';


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
