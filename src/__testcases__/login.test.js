import React from 'react';
import { render, fireEvent, waitFor ,screen} from '@testing-library/react';
import Login from '../LoginRegister/Login';
import AdminDashboard from '../Admin/adminDashboard';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../Components/categoryApi';
import * as postApi from '../Components/categoryPostApi';
jest.mock('../Components/categoryApi');
jest.mock('../Components/categoryPostApi');
describe('Login component', () => {
  it('should render login form', async () => {
    // Render the component
    render( <MemoryRouter>
      <Login />
    </MemoryRouter>);
    await waitFor(() => {
      screen.getByText('Login');
    });
  });
});

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
}));

describe('Api testing for category function', () => {
  beforeEach(()=> jest.clearAllMocks());
  it('should render category data', async () => {

    api.CategoryGetApi.mockResolvedValue({
      categories: [
        {
          name: 'Gifts',
        }
      ],
    })
    // Render the component
    render( <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>);

    
    await waitFor(() => {
      screen.getByText('Gifts');
     
    });
  });

  it('should render error message when category api fails', async () => {

    api.CategoryGetApi.mockRejectedValue({
      
    })
    // Render the component
    render( <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>);

    
    await waitFor(() => {
      screen.getByText('No categories available.');
     
    });
  });


  it('should handle form submission and display success message', async () => {
    // Mock the resolved value of the POST category API
    postApi.PostCategory.mockResolvedValue({
      success: true,
      message: 'Category added',
    });

    // Render the component
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Get the input field for adding a new category
    const categoryInput = screen.getByPlaceholderText('Enter category name');

    // Fill in the input field with a category name
    fireEvent.change(categoryInput, { target: { value: 'New Category' } });

    // Get the submit button
    const submitButton = screen.getByText('Add');

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Category Added Successfully.')).toBeInTheDocument();
    });
  });
});
