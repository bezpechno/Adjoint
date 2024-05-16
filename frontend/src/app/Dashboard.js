import React, { useState, useEffect, useRef } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import { useUserAuthentication } from '../hooks/useUserAuthentication';
import { Container, Row, Col, Button, ButtonGroup, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import QRCode from 'qrcode.react';

const Dashboard = () => {
  const { username, token } = useUserAuthentication();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  // Add an additional check to ensure username is set
  if (!analyticsData || !username) {
    return <div>Loading...</div>;
  }

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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
              <ButtonGroup className="me-2">
                <Button variant="outline-secondary" size="sm">Share</Button>
                <Button variant="outline-secondary" size="sm">Export</Button>
              </ButtonGroup>
              <Button variant="outline-secondary" size="sm" onClick={handleShowModal}>
                <span data-feather="calendar"></span>
                QR-Code
              </Button>
            </div>
          </div>

          <div className="chart-container mb-4" style={{ height: '300px' }}>
            <h3>Page Views Over Time</h3>
            <Line data={viewsOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
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
              {analyticsData.top_dishes.map((dish, index) => (
                <tr key={dish._id}>
                  <td>{index + 1}</td>
                  <td>{dish.name}</td>
                  <td>{dish.likes}</td>
                  <td>{dish.details}</td>
                  <td>{dish.price}</td>
                </tr>
              ))}
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
