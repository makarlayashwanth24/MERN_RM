import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            setAlert({ show: true, message: 'Login successful!', type: 'success' });
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setAlert({ show: true, message: 'Login failed. Please check your credentials.', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
        }
    };

    return (
        <div className="container mt-5">
            <div className="form-container">
                <h2>Login</h2>
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
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;