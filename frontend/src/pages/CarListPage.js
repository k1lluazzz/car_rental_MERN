import React, { useEffect, useState } from 'react';
import { Grid, Button, Card, CardContent, CardMedia, Typography, CardActions } from '@mui/material';
import axios from 'axios';

const CarListPage = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars')
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/cars/${id}`);
            setCars(cars.filter(car => car._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            {cars.map(car => (
                <Grid item xs={12} sm={6} md={4} key={car._id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={`http://localhost:5000${car.image}`}
                            alt={car.name}
                        />
                        <CardContent>
                            <Typography variant="h5">{car.name}</Typography>
                            <Typography color="text.secondary">Brand: {car.brand}</Typography>
                            <Typography color="text.secondary">Price/Day: ${car.pricePerDay}</Typography>
                            <Typography color={car.available ? 'green' : 'red'}>
                                {car.available ? 'Available' : 'Not Available'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant="contained" color="primary">
                                Edit
                            </Button>
                            <Button size="small" variant="contained" color="error" onClick={() => handleDelete(car._id)}>
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CarListPage;
