import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setAlert({ show: true, message: 'Password reset link sent to your email.', type: 'success' });
        } catch (error) {
            setAlert({ show: true, message: 'Failed to send password reset link. Please try again.', type: 'danger' });
        }
    };
    return (
        <div className="container mt-5">
            <div className="form-container">
                <h2>Forgot Password</h2>
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
                    <button type="submit" className="btn btn-primary">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
