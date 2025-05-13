import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Divider, Paper, Button } from '@mui/material';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ChairIcon from '@mui/icons-material/Chair';
import BookingForm from '../components/BookingForm';
import CarCard from '../components/CarCard';

const CarDetailPage = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [similarCars, setSimilarCars] = useState([]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
                setCar(response.data);
            } catch (error) {
                console.error('Error fetching car details:', error);
            }
        };
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (car) {
            const fetchSimilarCars = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/cars', {
                        params: {
                            brand: car.brand
                        }
                    });
                    setSimilarCars(response.data.filter(c => c._id !== car._id));
                } catch (error) {
                    console.error('Error fetching similar cars:', error);
                }
            };
            fetchSimilarCars();
        }
    }, [car]);

    if (!car) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Grid container spacing={3}>
                {/* Car Image */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <img
                            src={car.image || 'https://via.placeholder.com/600x400'}
                            alt={car.name}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                    </Paper>
                </Grid>

                {/* Car Details */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '20px' }}>
                        <Typography variant="h4" gutterBottom>
                            {car.name}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {car.pricePerDay.toLocaleString()}K/ngày
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <DirectionsCarIcon />
                            <Typography>{car.transmission}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <LocalGasStationIcon />
                            <Typography>{car.fuelType}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <ChairIcon />
                            <Typography>{car.seats} chỗ ngồi</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <LocationOnIcon />
                            <Typography>{car.location}</Typography>
                        </Box>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            sx={{ mt: 2 }}
                            onClick={() => setShowBookingForm(true)}
                        >
                            Đặt xe ngay
                        </Button>
                    </Paper>
                </Grid>

            </Grid>

            {showBookingForm && (
                <Box sx={{ mt: 4 }}>
                    <BookingForm 
                        carId={id} 
                        onBookingSuccess={() => setShowBookingForm(false)}
                    />
                </Box>
            )}
            {/* Similar Cars Section */}
            {similarCars.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                            Xe tương tự ({similarCars.length})
                        </Typography>
                        <Grid container spacing={3}>
                            {similarCars.map(similarCar => (
                                <Grid item xs={12} sm={6} md={3} key={similarCar._id}>
                                    <CarCard car={similarCar} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                )}
        </Box>
    );
};

export default CarDetailPage;
