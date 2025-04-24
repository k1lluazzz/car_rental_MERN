import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users') // Ensure this matches your backend URL
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            setUsers(users.filter(user => user._id !== id)); // Remove the deleted user from the list
            alert('User deleted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to delete user.');
        }
    };

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {users.map(user => (
                <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Name: {user.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Email: {user.email || 'N/A'}
                            </Typography>
                            <Typography color="text.secondary">
                                Phone: {user.phone || 'N/A'}
                            </Typography>
                        </CardContent>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(user._id)}>
                            Delete
                        </Button>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default UserList;
