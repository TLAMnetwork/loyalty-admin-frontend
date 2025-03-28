import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css';

const DashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get('https://loyaltyappdb.onrender.com/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching data');
        }
    };

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');

            await axios.delete(`https://loyaltyappdb.onrender.com/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuccess('User deleted successfully.');
            fetchUsers(); // Refresh the user list
        } catch (err) {
            setError(err.response?.data?.error || 'Error deleting user');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Admin Dashboard</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Admin</th>
                        <th>Business</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.is_admin ? 'Yes' : 'No'}</td>
                            <td>{user.is_business ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => deleteUser(user.user_id)} style={{ color: 'red' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPage;