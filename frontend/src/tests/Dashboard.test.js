import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Dashboard from '../app/Dashboard';
import '@testing-library/jest-dom';

// Mock axios to avoid making actual API calls during tests
jest.mock('axios');

// Mock useUserAuthentication hook
jest.mock('../hooks/useUserAuthentication', () => ({
  useUserAuthentication: () => ({ username: 'testuser', token: 'test-token' })
}));

// Mock SidebarMenu component
jest.mock('../components/SidebarMenu', () => () => <div>SidebarMenu</div>);

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    axios.get.mockClear();
  });

  it('renders the sidebar menu and dashboard title', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('SidebarMenu')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });



  it('displays correct data in likes on dishes table', async () => {
    const mockData = {
      top_dishes: [
        { _id: '1', name: 'Dish 1', likes: 10, details: 'Details 1', price: 100 },
        { _id: '2', name: 'Dish 2', likes: 20, details: 'Details 2', price: 200 }
      ]
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText('Dish 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Details 1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Dish 2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Details 2')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('displays no data message for views over time chart', async () => {
    axios.get.mockResolvedValueOnce({ data: { views_over_time: [] } });

    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('Page Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('No data available for the graph.')).toBeInTheDocument();
  });

  it('displays no data message for likes on dishes table', async () => {
    axios.get.mockResolvedValueOnce({ data: { top_dishes: [] } });

    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('Likes on Dishes')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
