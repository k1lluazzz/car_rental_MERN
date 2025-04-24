import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CarCard = ({ car }) => {
    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', borderRadius: '10px', boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="180"
                image={car.image || 'https://via.placeholder.com/345x180'} // Use the Cloudinary URL or a placeholder
                alt={car.name}
            />
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} noWrap>
                    {car.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px', color: 'text.secondary' }}>
                    <Typography variant="body2">
                        <DirectionsCarIcon fontSize="small" /> {car.transmission}
                    </Typography>
                    <Typography variant="body2">
                        {car.seats} chỗ
                    </Typography>
                    <Typography variant="body2">
                        {car.fuelType}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', color: 'text.secondary' }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2" noWrap>
                        {car.location}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                            <StarIcon fontSize="small" /> {car.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {car.trips} chuyến
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {car.pricePerDay}K/giờ
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CarCard;
