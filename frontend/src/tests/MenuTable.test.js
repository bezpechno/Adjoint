import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MenuTable from '../components/MenuTable';

jest.mock('axios');

describe('MenuTable Component', () => {
  const token = "testToken";

  beforeAll(() => {
    window.alert = jest.fn();
  });

  test('renders table with headers and initial row', () => {
    render(<MenuTable token={token} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Allergens')).toBeInTheDocument();
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();

    // Check if initial row is rendered
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });

  test('adds a new row when Add button is clicked', async () => {
    render(<MenuTable token={token} />);

    const addButton = screen.getByText('Add');
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Check if new row is added
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(1);
  });


  test('submits data when Submit button is clicked', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<MenuTable token={token} />);

    const nameInput = screen.getAllByRole('textbox').find(input => input.name === 'name');
    const detailsInput = screen.getAllByRole('textbox').find(input => input.name === 'details');
    const priceInput = screen.getAllByRole('spinbutton').find(input => input.name === 'price');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test Name' } });
      fireEvent.change(detailsInput, { target: { value: 'Test Details' } });
      fireEvent.change(priceInput, { target: { value: '10.00' } });
    });

    const submitButton = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/menu/',
        expect.any(Object),
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });
  });
});
