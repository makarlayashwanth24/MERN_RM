import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Login from './component/Login';
import Register from './component/Register';
import Dashboard from './component/Dashboard';
import AnalyzeResume from './component/AnalyzeResume';
import Home from './pages/Home';
import ForgotPassword from './component/ForgotPassword';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyse-resume" element={<AnalyzeResume />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
}

export default App;