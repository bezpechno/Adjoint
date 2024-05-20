// src/tests/SidebarMenu.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useError } from '../features/errors/ErrorContext';
import SidebarMenu from '../components/SidebarMenu';

// Mock the useNavigate function from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the useError hook
jest.mock('../features/errors/ErrorContext', () => ({
  useError: jest.fn(),
}));

describe('SidebarMenu', () => {
  const mockNavigate = require('react-router-dom').useNavigate;
  const setError = jest.fn();
  const error = 'Some error';

  beforeEach(() => {
    mockNavigate.mockReturnValue(jest.fn());
    useError.mockReturnValue({ error, setError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders sidebar menu with username and links', () => {
    render(
      <MemoryRouter>
        <SidebarMenu username="testuser" />
      </MemoryRouter>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('calls handleLogout and navigates to /login on log out click', () => {
    const mockLogoutNavigate = jest.fn();
    mockNavigate.mockReturnValue(mockLogoutNavigate);

    render(
      <MemoryRouter>
        <SidebarMenu username="testuser" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Log out'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockLogoutNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders error modal when error is present', () => {
    render(
      <MemoryRouter>
        <SidebarMenu username="testuser" />
      </MemoryRouter>
    );

    expect(screen.getByText('Some error')).toBeInTheDocument();
  });

  test('handles close error modal and navigates to /login', () => {
    const mockCloseNavigate = jest.fn();
    mockNavigate.mockReturnValue(mockCloseNavigate);

    render(
      <MemoryRouter>
        <SidebarMenu username="testuser" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Go to Login')); // Updated to match the actual button text
    expect(setError).toHaveBeenCalledWith(null);
    expect(mockCloseNavigate).toHaveBeenCalledWith('/login');
  });
});
