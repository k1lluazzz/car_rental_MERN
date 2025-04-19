import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users') // Ensure this matches your backend URL
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleBlockUser = (userId) => {
        console.log(`Block user with ID: ${userId}`);
        // Add logic to block the user
    };

    const handleDeleteUser = (userId) => {
        console.log(`Delete user with ID: ${userId}`);
        // Add logic to delete the user
    };

    return (
        <TableContainer component={Paper} style={{ margin: '20px', padding: '20px' }}>
            <Typography variant="h6" component="div" style={{ marginBottom: '10px' }}>
                User List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role || 'User'}</TableCell>
                            <TableCell>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleBlockUser(user._id)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Block
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeleteUser(user._id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;
