import React from 'react';
import { 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Box, 
    Chip,
    Rating
} from '@mui/material';
import {
    DirectionsCar as DirectionsCarIcon,
    LocalGasStation as LocalGasStationIcon,
    Chair as ChairIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CarCard = ({ car, selectedStartDate, selectedEndDate }) => {
    const navigate = useNavigate();

    console.log('Car data:', car); // Debug log

    const handleCardClick = () => {
        navigate(`/cars/${car._id}`);
    };    const imageUrl = car.image || 'https://res.cloudinary.com/dhyqgl7ie/image/upload/v1/car_images/default-car.png';

    // Calculate total rental time
    const calculateRentalPeriod = () => {
        if (!selectedStartDate || !selectedEndDate) return null;
        
        const start = new Date(selectedStartDate);
        const end = new Date(selectedEndDate);
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        
        if (hours >= 24) {
            const days = Math.ceil(hours / 24);
            return `${days} ngày`;
        }
        return `${hours} giờ`;
    };

    const rentalPeriod = calculateRentalPeriod();
    const totalPrice = rentalPeriod && car.pricePerDay * (parseInt(rentalPeriod) || 1);

    return (
        <Card 
            onClick={handleCardClick}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out'
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={car.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/car_images/default-car.png';
                    }}
                />
                {car.discount > 0 && (
                    <Chip
                        label={`Giảm ${car.discount}%`}
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 'bold'
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }} noWrap>
                    {car.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                        value={car.rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({car.totalRatings || 0} đánh giá)
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{car.transmission}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalGasStationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{car.fuelType}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ChairIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{car.seats} chỗ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>
                            {car.location}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {car.pricePerDay.toLocaleString()}đ/ngày
                    </Typography>
                    {rentalPeriod && (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Thời gian thuê: {rentalPeriod}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                Tổng: {totalPrice?.toLocaleString()}đ
                            </Typography>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CarCard;
