import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car }) => {
    const navigate = useNavigate();

    console.log('Car data:', car); // Debug log

    const handleCardClick = () => {
        navigate(`/cars/${car._id}`);
    };    const imageUrl = car.image || 'https://res.cloudinary.com/dhyqgl7ie/image/upload/v1/car_images/default-car.png';

    return (
        <Card 
            onClick={handleCardClick}
            sx={{ 
                maxWidth: 345, 
                margin: 'auto', 
                borderRadius: '10px', 
                boxShadow: 3,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                }
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={imageUrl}
                alt={car.name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/car_images/default-car.png';
                }}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>                            <StarIcon sx={{ color: '#FFD700', fontSize: 'small' }} />                            <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                                {typeof car.rating === 'number' ? `${car.rating.toFixed(1)}/5` : '0.0/5'}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {car.trips || 0} chuyến
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
