import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CategoriesTable from '../components/CategoriesTable';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockCategories = [
  { _id: { $oid: '1' }, name: 'Category 1', dishes: [] },
  { _id: { $oid: '2' }, name: 'Category 2', dishes: [] }
];

const mockMenuItems = [
  { name: 'Dish 1', _id: { $oid: '1' } },
  { name: 'Dish 2', _id: { $oid: '2' } },
  { name: 'Dish 3', _id: { $oid: '3' } }
];

const setup = async () => {
  axios.get
    .mockResolvedValueOnce({ data: { menu: JSON.stringify(mockMenuItems) } })
    .mockResolvedValueOnce({ data: { categories: mockCategories } });

  render(<CategoriesTable token="test-token" />);
  await waitFor(() => screen.getByText('Category 1'));
};

describe('CategoriesTable Component', () => {
  it('renders table with categories', async () => {
    await setup();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('adds a new category', async () => {
    await setup();
    window.prompt = jest.fn().mockImplementation(() => 'New Category');
    fireEvent.click(screen.getByText('Add Category'));
    await waitFor(() => screen.getByText('New Category'));
    expect(screen.getByText('New Category')).toBeInTheDocument();
  });

  it('prompts when clicking "Add Category"', async () => {
    await setup();
    window.prompt = jest.fn();
    fireEvent.click(screen.getByText('Add Category'));
    expect(window.prompt).toHaveBeenCalled();
  });
});
