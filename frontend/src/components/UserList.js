import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {users.map(user => (
                <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {user.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Email: {user.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default UserList;
