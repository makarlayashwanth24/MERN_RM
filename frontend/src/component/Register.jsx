import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { email, password });
            setAlert({ show: true, message: 'Registration successful! Please login.', type: 'success' });
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                navigate('/login');
            }, 2000);
        } catch (error) {
            setAlert({ show: true, message: 'Registration failed. Please try again.', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container">
                <h2>Register</h2>
                {alert.show && (
                    <div className={`alert alert-${alert.type} text-center`} role="alert">
                        {alert.message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;