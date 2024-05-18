import React, { useState, useEffect, useRef } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';
import { Container, Row, Col, Button, ButtonGroup, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import QRCode from 'qrcode.react';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

const Dashboard = () => {
  const { username, token } = useUserAuthentication();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [viewsOverTimeData, setViewsOverTimeData] = useState({});
  const qrRef = useRef(null);

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

  useEffect(() => {
    if (analyticsData && analyticsData.views_over_time && analyticsData.views_over_time.length > 0) {
      // Prepare data for regression
      const viewsOverTime = analyticsData.views_over_time.map(view => ({
        date: new Date(view._id).getTime(),
        count: view.count
      }));
      const data = viewsOverTime.map(view => [view.date, view.count]);

      // Perform linear regression
      const regressionResult = linearRegression(data);
      const regressionLine = linearRegressionLine(regressionResult);

      // Generate forecast for the next 7 days
      const lastDate = new Date(Math.max(...data.map(d => d[0])));
      const forecastData = [];
      for (let i = 1; i <= 7; i++) {
        const newDate = new Date(lastDate);
        newDate.setDate(lastDate.getDate() + i);
        forecastData.push([newDate.getTime(), regressionLine(newDate.getTime())]);
      }

      const forecastDates = forecastData.map(d => new Date(d[0]).toISOString().split('T')[0]);
      const forecastCounts = forecastData.map(d => d[1]);

      const actualDates = analyticsData.views_over_time.map(view => view._id);
      const actualCounts = analyticsData.views_over_time.map(view => view.count);

      setViewsOverTimeData({
        labels: [...actualDates, ...forecastDates],
        datasets: [
          {
            label: 'Actual Views',
            data: actualCounts,
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 0.6)',
            pointBorderColor: 'rgba(75, 192, 192, 1)',
          },
          {
            label: 'Forecasted Views',
            data: [...Array(actualCounts.length).fill(null), ...forecastCounts],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgba(255, 99, 132, 0.6)',
            pointBorderColor: 'rgba(255, 99, 132, 1)',
            borderDash: [5, 5],
            hidden: !showForecast,
          }
        ]
      });
    } else {
      setViewsOverTimeData({
        labels: [],
        datasets: []
      });
    }
  }, [analyticsData, showForecast]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleToggleForecast = () => setShowForecast(prevShowForecast => !prevShowForecast);

  const qrValue = `${window.location.origin}/m/${username}`;

  const handleDownloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = url;
      a.download = `QRCode_${username}.png`;
      a.click();
    }
  };

  if (!analyticsData || !username) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-4">
          <SidebarMenu username={username} />
        </Col>
        <Col md={10} className="p-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Button variant="outline-secondary" size="sm" onClick={handleShowModal}>
                <span data-feather="calendar"></span>
                QR-Code
              </Button>
            </div>
          </div>

          <div className="chart-container mb-4 pb-5" style={{ height: '300px' }}>
            <h3>Page Views Over Time</h3>
            {viewsOverTimeData.labels.length > 0 && viewsOverTimeData.datasets.length > 0 && (
              <Line data={viewsOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
            {viewsOverTimeData.labels.length === 0 && (
              <p>No data available for the graph.</p>
            )}
          </div>

          <h2 className='mt-5'>Likes on Dishes</h2>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Dish Name</th>
                <th>Likes</th>
                <th>Details</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.top_dishes && analyticsData.top_dishes.length > 0 ? (
                analyticsData.top_dishes.map((dish, index) => (
                  <tr key={dish._id}>
                    <td>{index + 1}</td>
                    <td>{dish.name}</td>
                    <td>{dish.likes}</td>
                    <td>{dish.details}</td>
                    <td>{dish.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code for Public Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center" ref={qrRef}>
          <QRCode value={qrValue} size={256} />
          <div className="mt-3">
            <Button variant="primary" onClick={handleDownloadQRCode}>
              Download QR Code
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Dashboard;
