import React from 'react';
import { Container, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  return (
    <div>
      {/* Верхний контейнер, заменяющий Navbar */}
      <Container className="py-3 bg-dark text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <a href="#" className="text-white text-decoration-none">Industrial Design</a>
          </div>
          <Nav className="ml-auto">
            <Nav.Link href="/login" className="text-white">Login</Nav.Link>
            <Nav.Link href="/register" className="text-white">Register</Nav.Link>
          </Nav>
        </div>
      </Container>

      {/* Основной контент страницы */}
      <Container style={{ padding: '2rem 0' }}>
        <Row className="mb-4">
          <Col md={12}>
            <h1>Welcome to Our Industrial Design Landing</h1>
            <p>This minimalist industrial design space is focused on functionality and simplicity.</p>
          </Col>
        </Row>

        <Row>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Col md={4} key={idx}>
              <Card>
                <Card.Img variant="top" src={`https://via.placeholder.com/300x200?text=Product+${idx + 1}`} />
                <Card.Body>
                  <Card.Title>Product {idx + 1}</Card.Title>
                  <Card.Text>
                    This is a wider card with supporting text below as a natural lead-in to additional content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Нижний футер, заменяющий Navbar */}
      <Container className="py-3 bg-light text-center fixed-bottom">
        <span className="text-muted">© 2024 Industrial Design Landing</span>
      </Container>
    </div>
  );
}

export default LandingPage;
