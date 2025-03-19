import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userResponse.data.role === 'admin') {
                    setIsAdmin(true);
                    const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsers(usersResponse.data);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Failed to fetch users or check admin status:', error);
                navigate('/login');
            }
        };

        fetchUsers();
    }, [navigate]);

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="container mt-5">
            <h2>Admin Dashboard</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;