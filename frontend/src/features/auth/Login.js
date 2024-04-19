import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', userData);
            console.log(response.data);

            // Save the token to local storage
            localStorage.setItem('token', response.data.token);

            // Redirect to /dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default LoginForm;