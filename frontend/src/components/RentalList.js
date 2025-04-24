import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

const RentalList = () => {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/rentals') // Ensure this matches your backend URL
            .then(response => setRentals(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/rentals/${id}`);
            setRentals(rentals.filter(rental => rental._id !== id)); // Remove the deleted rental from the list
            alert('Rental deleted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to delete rental.');
        }
    };

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {rentals.map(rental => (
                <Grid item xs={12} sm={6} md={4} key={rental._id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Renter: {rental.userName}
                            </Typography>
                            <Typography color="text.secondary">
                                Car ID: {rental.car}
                            </Typography>
                            <Typography color="text.secondary">
                                Start Date: {new Date(rental.startDate).toLocaleString()}
                            </Typography>
                            <Typography color="text.secondary">
                                End Date: {new Date(rental.endDate).toLocaleString()}
                            </Typography>
                        </CardContent>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(rental._id)}>
                            Delete
                        </Button>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RentalList;
