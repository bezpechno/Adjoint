import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import "../custom.css"

import axios from 'axios';

function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            console.log(response.data);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
    
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
    
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
    
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </div>
      );
}

export default RegistrationForm;