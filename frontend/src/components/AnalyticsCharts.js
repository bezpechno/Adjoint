import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalyticsCharts = ({ token }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/analytics/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Received analytics data:', response.data);
        setAnalyticsData(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch analytics data:', error);
      });
    }
  }, [token]);

  if (!analyticsData) {
    return <div>Loading...</div>;
  }

  console.log('Top dishes data:', analyticsData.top_dishes);
  console.log('Views over time data:', analyticsData.views_over_time);
  console.log('Likes over time data:', analyticsData.likes_over_time);
  console.log('Device usage data:', analyticsData.device_usage);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const topDishesData = {
    labels: analyticsData.top_dishes.map(dish => dish.name),
    datasets: [{
      label: 'Likes',
      data: analyticsData.top_dishes.map(dish => dish.likes),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const viewsOverTimeData = {
    labels: analyticsData.views_over_time.map(view => view._id),
    datasets: [{
      label: 'Views',
      data: analyticsData.views_over_time.map(view => view.count),
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)'
    }]
  };

  const likesOverTimeData = {
    labels: analyticsData.likes_over_time.map(like => like._id),
    datasets: [{
      label: 'Likes',
      data: analyticsData.likes_over_time.map(like => like.count),
      fill: false,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)'
    }]
  };

  const deviceUsageData = {
    labels: analyticsData.device_usage.map(device => device._id || 'Unknown'),
    datasets: [{
      label: 'Device Usage',
      data: analyticsData.device_usage.map(device => device.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="chart-container">
        <h3>Top 5 Dishes by Likes</h3>
        <Bar data={topDishesData} options={chartOptions} height={300} />
      </div>

      <div className="chart-container mt-5">
        <h3>Views Over Time</h3>
        <Line data={viewsOverTimeData} options={chartOptions} height={300} />
      </div>

      <div className="chart-container mt-5">
        <h3>Likes Over Time</h3>
        <Line data={likesOverTimeData} options={chartOptions} height={300} />
      </div>

      <div className="chart-container mt-5">
        <h3>Device Usage</h3>
        <Pie data={deviceUsageData} options={chartOptions} height={300} />
      </div>
    </div>
  );
}

export default AnalyticsCharts;
