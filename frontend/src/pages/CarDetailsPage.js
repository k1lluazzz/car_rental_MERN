import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CardMedia } from '@mui/material';
import axios from 'axios';

const CarDetailsPage = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/cars/${id}`)
            .then(response => setCar(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!car) {
        return <Typography>Loading car details...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <CardMedia
                component="img"
                height="300"
                image={`http://localhost:5000${car.image}`}
                alt={car.name}
                sx={{ marginBottom: '20px' }}
            />
            <Typography variant="h4">{car.name}</Typography>
            <Typography variant="h6" color="text.secondary">Brand: {car.brand}</Typography>
            <Typography variant="h6" color="text.secondary">Price/Day: ${car.pricePerDay}</Typography>
            <Typography variant="h6" color={car.available ? 'green' : 'red'}>
                {car.available ? 'Available' : 'Not Available'}
            </Typography>
        </Box>
    );
};

export default CarDetailsPage;
