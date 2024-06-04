import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './custom.css'; // Import the shared CSS file

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

            localStorage.setItem('token', response.data.token);

            navigate('/dashboard');
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="form-container d-flex align-items-center justify-content-center">
            <div className="form-box">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="formEmail">Email address</label>
                        <input 
                            type="email" 
                            id="formEmail"
                            className="form-control" 
                            placeholder="Enter email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="formPassword">Password</label>
                        <input 
                            type="password" 
                            id="formPassword"
                            className="form-control" 
                            placeholder="Password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-4">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
