import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

function LandingPage() {
    return (
        <div>
            <Container className="p-5 bg-light">
                <h1>Welcome to Our Site!</h1>
                <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <h2>Login</h2>
                        <Link to="/login">
                            <Button variant="primary">
                                Login
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <h2>Register</h2>
                        <Link to="/register">
                            <Button variant="primary">
                                Register
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LandingPage;