import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const toggleForm = () => {
        setShowLogin(!showLogin);
        setName('');
        setEmail('');
        setPassword('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            setRole(response.data.user.role);
            setAlert({ show: true, message: 'Login successful!', type: 'success' });
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                navigate('/');
                window.location.reload(); // Reload the page to close the modal
            }, 2000);
        } catch (error) {
            setAlert({ show: true, message: 'Login failed. Please check your credentials.', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
            setAlert({ show: true, message: 'Signup successful! Please login.', type: 'success' });
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                setShowLogin(true); // Switch to login form
            }, 2000);
        } catch (error) {
            setAlert({ show: true, message: 'Signup failed. Please try again.', type: 'danger' });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setRole(null);
        navigate('/');
    };

    const handleProtectedLink = (e) => {
        if (!role) {
            e.preventDefault();
            window.alert('Please sign in to access this page.');
        }
    };

    return (
        <div className="home-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top">
                <Link className="navbar-brand" to="/">ResuMate</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/analyse-resume" onClick={handleProtectedLink}>Services</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/references" onClick={handleProtectedLink}>References</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                    </ul>
                    {role ? (
                        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                    ) : (
                        <div>
                            <button className="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#authModal" onClick={() => setShowLogin(true)}>Login</button>
                            <button className="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#authModal" onClick={() => setShowLogin(false)}>Register</button>
                        </div>
                    )}
                </div>
            </nav>

            {alert.show && (
                <div className={`alert alert-${alert.type} text-center`} role="alert">
                    {alert.message}
                </div>
            )}

            <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content p-4">
                        <div className="d-flex justify-content-between">
                            <h5 id="authModalLabel" className='hd'>{showLogin ? 'Login Form' : 'Register Form'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        {showLogin ? (
                            <form id="loginForm" className="mt-3" onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="loginEmail" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="loginEmail" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="loginPassword" className="form-label">Password</label>
                                    <input type={showPassword ? "text" : "password"} className="form-control" id="loginPassword" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <i className="toggle-password position-absolute top-50 end-0 translate-middle-y me-3" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </i>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberCheck" />
                                        <label className="form-check-label" htmlFor="rememberCheck">Remember me</label>
                                    </div>
                                    <Link to="api/auth/forgot-password" className="small">Forgot password?</Link>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Login</button>
                                <div className="text-center mt-3">
                                    <span className='msg' >Don't have an account? </span>
                                    <Link to="#" onClick={toggleForm}>Register</Link>
                                </div>
                            </form>
                        ) : (
                            <form id="signupForm" className="mt-3" onSubmit={handleSignup}>
                                <div className="mb-3">
                                    <label htmlFor="signupName" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="signupName" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="signupEmail" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="signupEmail" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="signupPassword" className="form-label">Create Password</label>
                                    <input type={showPassword ? "text" : "password"} className="form-control" id="signupPassword" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <i className="toggle-password position-absolute top-50 end-0 translate-middle-y me-3" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </i>
                                </div>
                                <button type="submit" className="btn btn-success w-100">Register</button>
                                <div className="text-center mt-3">
                                    <span className='msg'>Already have an account? </span>
                                    <Link to="#" onClick={toggleForm}>Login</Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;