import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import AnalyticsCharts from '../components/AnalyticsCharts';
import '@testing-library/jest-dom';

// Mock the canvas method required by Chart.js
HTMLCanvasElement.prototype.getContext = () => {
  // Return a mock context with required methods for Chart.js
  return {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    createImageData: jest.fn().mockReturnValue({}),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 0 }),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
  };
};

jest.mock('axios');

const mockAnalyticsData = {
  top_dishes: [
    { name: 'Dish 1', likes: 100 },
    { name: 'Dish 2', likes: 80 },
    { name: 'Dish 3', likes: 60 },
    { name: 'Dish 4', likes: 40 },
    { name: 'Dish 5', likes: 20 }
  ],
  views_over_time: [
    { _id: '2021-01', count: 200 },
    { _id: '2021-02', count: 300 },
    { _id: '2021-03', count: 400 }
  ],
  likes_over_time: [
    { _id: '2021-01', count: 50 },
    { _id: '2021-02', count: 60 },
    { _id: '2021-03', count: 70 }
  ],
  device_usage: [
    { _id: 'Mobile', count: 500 },
    { _id: 'Desktop', count: 300 },
    { _id: 'Tablet', count: 100 }
  ]
};

describe('AnalyticsCharts Component', () => {

  it('fetches and displays analytics data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockAnalyticsData });

    render(<AnalyticsCharts token="test-token" />);

    await waitFor(() => expect(screen.getByText('Top 5 Dishes by Likes')).toBeInTheDocument());
    expect(screen.getByText('Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('Likes Over Time')).toBeInTheDocument();
    expect(screen.getByText('Device Usage')).toBeInTheDocument();
  });

});
