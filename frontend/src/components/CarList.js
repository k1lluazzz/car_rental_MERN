import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, CardMedia } from '@mui/material';
import axios from 'axios';

const CarList = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars') // Ensure this matches your backend URL
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {cars.map(car => (
                <Grid item xs={12} sm={6} md={4} key={car._id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={`http://localhost:5000${car.image}`} // Display the car image
                            alt={car.name}
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {car.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Brand: {car.brand}
                            </Typography>
                            <Typography color="text.secondary">
                                Price/Day: ${car.pricePerDay}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary">
                                View Details
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CarList;
