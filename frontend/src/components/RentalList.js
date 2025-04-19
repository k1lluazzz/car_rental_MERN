import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const RentalList = () => {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        axios.get('/api/rentals')
            .then(response => setRentals(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {rentals.map(rental => (
                <Grid item xs={12} sm={6} md={4} key={rental._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Car: {rental.car.name}
                            </Typography>
                            <Typography color="text.secondary">
                                User: {rental.user.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Start Date: {new Date(rental.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography color="text.secondary">
                                End Date: {new Date(rental.endDate).toLocaleDateString()}
                            </Typography>
                            <Typography color="text.secondary">
                                Total Cost: ${rental.totalCost}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RentalList;
