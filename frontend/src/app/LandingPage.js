import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Nav, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://picsum.photos/v2/list', {
          params: { page: 2, limit: 3 }
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images from Lorem Picsum:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <Container className="py-3 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <a href="/login" className="text-dark text-decoration-none display-3">Adjoint</a>
          </div>
          <Nav className="ml-auto">
            <Nav.Link href="/login" className="text-dark">Login</Nav.Link>
            <Nav.Link href="/register" className="text-dark">Register</Nav.Link>
          </Nav>
        </div>
      </Container>

      <Container style={{ padding: '2rem 0' }}>
        <Row className="mb-4">
          <Col md={12} className="text-center">
            <h1>Ласкаво просимо до Adjoint</h1>
            <p>
              Веб-додаток представляє собою новітній веб-сервіс, розроблений з метою оптимізації управління контентом та користувацької взаємодії в онлайн-просторі.
              Додаток дозволить користувачам з легкістю переглядати меню різноманітних ресторанів, фільтрувати страви за різними критеріями, відгукуватися на улюблені позиції та робити замовлення офлайн.
            </p>
          </Col>
        </Row>

        <Row>
          {images.length > 0 && images.map((image, idx) => (
            <Col md={4} key={image.id}>
              <Card className="mb-4 shadow-sm">
                <Card.Img variant="top" src={image.download_url} alt={image.author} />
                <Card.Body>
                  <Card.Title>{idx === 0 ? 'Затишна атмосфера' : idx === 1 ? 'Швидкий доступ до меню' : 'Легке замовлення'}</Card.Title>
                  <Card.Text>
                    {idx === 0 ? 'Наш додаток допоможе вам розширити кордони вашого бізнесу та перенести паперові меню у онлайн.'
                      : idx === 1 ? 'Створюйте меню для ваших закладів безкоштовно, будьте поряд з клієнтами.'
                      : 'Розширюйте свій бізнес з нами. Знижаюси затрати на послуги, збільшуючи маржу досягайте результатів.'}
                  </Card.Text>
                  {idx === 2 && <Button variant="primary" href="/register">Зареєструватись</Button>}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="py-3 bg-light text-center">
        <span className="text-muted">© 2024 Adjoint</span>
      </Container>
    </div>
  );
}

export default LandingPage;
