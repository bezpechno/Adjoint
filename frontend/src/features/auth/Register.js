import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './custom.css'; // Import the shared CSS file

function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false); // State for success message
    const [error, setError] = useState(""); // State for error message

    const navigate = useNavigate(); // Initialize useHistory

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            await axios.post('http://localhost:5000/api/auth/register', userData);
            setSuccess(true); // Set success to true on successful registration
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after 2 seconds
            }, 2000);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error); // Set error message from server
            } else {
                setError('There was an error!'); // Set a generic error message
            }
        }
    };

    return (
        <div className="form-container d-flex align-items-center justify-content-center">
            <div className="form-box">
                <h2 className="text-center mb-4">Register</h2>
                {success ? (
                    <div className="alert alert-success text-center" role="alert">
                        Registration successful! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="formUsername">Username</label>
                            <input 
                                type="text" 
                                id="formUsername"
                                className="form-control" 
                                placeholder="Enter username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
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

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100 mt-4">
                            Register
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RegistrationForm;
