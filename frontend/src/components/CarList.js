import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, CardMedia, Pagination } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ChairIcon from '@mui/icons-material/Chair';
import axios from 'axios';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 8;

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars') // Ensure this matches your backend URL
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Calculate the cars to display on the current page
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
                {currentCars.map(car => (
                    <Grid item xs={12} sm={6} md={3} key={car._id}> {/* 4 cars per row */}
                        <Card
                            sx={{
                                borderRadius: '10px',
                                boxShadow: 3,
                                height: '100%', // Ensure cards stretch to fill the grid
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between', // Space out content evenly
                                alignItems: 'stretch', // Stretch content to fill the card
                                minHeight: '350px', // Set a consistent minimum height for all cards
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: '180px', // Fixed height for the image
                                    overflow: 'hidden',
                                    flexShrink: 0, // Prevent shrinking of the image box
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    image={car.image || 'https://via.placeholder.com/180'} // Fallback to placeholder image
                                    alt={car.name}
                                    sx={{
                                        borderRadius: '10px 10px 0 0',
                                        objectFit: 'contain', // Ensure the full image is displayed
                                        width: '100%', // Ensure the image fills the width
                                        backgroundColor: '#f5f5f5', // Add a background color for better appearance
                                    }}
                                />
                                {car.discount > 0 && (
                                    <Chip
                                        label={`Giảm ${car.discount}%`}
                                        color="error"
                                        sx={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                )}
                            </Box>
                            <CardContent
                                sx={{
                                    flex: '1 1 auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '16px', // Add padding for better spacing
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        {car.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'text.secondary', marginBottom: '10px' }}>
                                        <DirectionsCarIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {car.transmission}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'text.secondary', marginBottom: '10px' }}>
                                        <LocalGasStationIcon fontSize="small" />
                                        <Typography variant="body2">
                                            {car.fuelType}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'text.secondary', marginBottom: '10px' }}>
                                        <ChairIcon fontSize="small" />
                                        <Typography variant="body2" noWrap>
                                            {car.seats} chỗ
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'text.secondary', marginBottom: '10px' }}>
                                        <LocationOnIcon fontSize="small" />
                                        <Typography variant="body2" noWrap>
                                            {car.location}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                            <StarIcon fontSize="small" marginTop="10px" /> {car.rating}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" marginLeft={2}>
                                            {car.trips} chuyến
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {car.pricePerDay.toLocaleString()}K/ngày
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={Math.ceil(cars.length / carsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default CarList;
