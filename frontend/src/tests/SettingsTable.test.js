import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SettingsTable from '../components/SettingsTable';

jest.mock('axios');

describe('SettingsTable Component', () => {
  test('renders User Settings card with buttons', () => {
    render(<SettingsTable token="testToken" />);

    expect(screen.getByText('User Settings')).toBeInTheDocument();
    expect(screen.getByText('Change Username')).toBeInTheDocument();
    expect(screen.getByText('Change Email')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  test('opens and closes modal on button click', async () => {
    render(<SettingsTable token="testToken" />);

    fireEvent.click(screen.getByText('Change Email'));
    expect(screen.getByText('Update email')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    await waitFor(() => {
      expect(screen.queryByText('Update email')).not.toBeInTheDocument();
    });
  });

  test('shows error message for invalid email', async () => {
    render(<SettingsTable token="testToken" />);

    fireEvent.click(screen.getByText('Change Email'));
    fireEvent.change(screen.getByLabelText(/New email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  test('shows error message for incorrect delete confirmation', async () => {
    render(<SettingsTable token="testToken" />);

    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.change(screen.getByLabelText(/delete-confirm-input/), { target: { value: 'no' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(await screen.findByText('You must type "Yes" to confirm deletion.')).toBeInTheDocument();
  });

  test('closes modal on successful submit', async () => {
    render(<SettingsTable token="testToken" />);

    fireEvent.click(screen.getByText('Change Email'));
    fireEvent.change(screen.getByLabelText(/New email/i), { target: { value: 'test@example.com' } });

    axios.post.mockResolvedValue({ data: { success: 'Setting updated successfully' } });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.queryByText('Update email')).not.toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/menu/settings/',
      { setting_type: 'email', value: 'test@example.com' },
      { headers: { Authorization: `Bearer testToken`, 'Content-Type': 'application/json' } }
    );
  });
});
