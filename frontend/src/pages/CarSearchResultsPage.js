import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, TextField, MenuItem, Button, Card, Paper, FormControl, InputLabel, Select, Slider } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';
import CarCard from '../components/CarCard';
import BookingForm from '../components/BookingForm';

const CarSearchResultsPage = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        priceRange: [0, 2000],
        brand: '',
        transmission: '',
        seats: '',
        fuelType: '',
    });
    const [sortBy, setSortBy] = useState('');
    const [sortedCars, setSortedCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const location = useLocation();

    // Extract the location query parameter
    const queryParams = new URLSearchParams(location.search);
    const selectedLocation = queryParams.get('location');

    useEffect(() => {
        // Fetch cars based on the selected location
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cars', {
                    params: {
                        location: selectedLocation,
                    },
                });
                setCars(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCars();
    }, [selectedLocation]);

    useEffect(() => {
        // Filter cars based on all criteria
        let filteredResults = cars.filter(car => {
            return (
                (!filters.brand || car.brand === filters.brand) &&
                (!filters.transmission || car.transmission === filters.transmission) &&
                (!filters.seats || car.seats === Number(filters.seats)) &&
                (!filters.fuelType || car.fuelType === filters.fuelType) &&
                car.pricePerDay >= filters.priceRange[0] &&
                car.pricePerDay <= filters.priceRange[1]
            );
        });

        // Sort filtered results
        let sorted = [...filteredResults];
        switch (sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        setSortedCars(sorted);
    }, [cars, filters, sortBy]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                Xe tại khu vực: {selectedLocation}
            </Typography>
            {/* Filter Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Bộ lọc tìm kiếm
                </Typography>
                <Grid container spacing={3}>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Thương hiệu"
                            fullWidth
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            sx={{ minWidth: '250px' }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Toyota">Toyota</MenuItem>
                            <MenuItem value="Honda">Honda</MenuItem>
                            <MenuItem value="Ford">Ford</MenuItem>
                            <MenuItem value="Hyundai">Hyundai</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Số ghế"
                            fullWidth
                            value={filters.seats}
                            onChange={(e) => handleFilterChange('seats', e.target.value)}
                            sx={{ minWidth: '250px' }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="4">4 chỗ</MenuItem>
                            <MenuItem value="5">5 chỗ</MenuItem>
                            <MenuItem value="7">7 chỗ</MenuItem>
                            <MenuItem value="16">16 chỗ</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Hộp số"
                            fullWidth
                            value={filters.transmission}
                            onChange={(e) => handleFilterChange('transmission', e.target.value)}
                            sx={{ minWidth: '250px' }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Số tự động">Số tự động</MenuItem>
                            <MenuItem value="Số sàn">Số sàn</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Nhiên liệu"
                            fullWidth
                            value={filters.fuelType}
                            onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                            sx={{ minWidth: '250px' }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Xăng">Xăng</MenuItem>
                            <MenuItem value="Dầu">Dầu</MenuItem>
                            <MenuItem value="Điện">Điện</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography gutterBottom>Giá thuê (K/ngày)</Typography>
                        <Slider
                            value={filters.priceRange}
                            onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={2000}
                            step={50}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{filters.priceRange[0]}K</Typography>
                            <Typography>{filters.priceRange[1]}K</Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Paper>

            {/* Sort Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                    Tìm thấy {sortedCars.length} xe
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Sắp xếp theo</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sắp xếp theo"
                        startAdornment={<SortIcon />}
                    >
                        <MenuItem value="">Mặc định</MenuItem>
                        <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                        <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                        <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Car Grid */}
            <Grid 
                container 
                spacing={3}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}
            >
                {sortedCars.map((car) => (
                    <Grid item key={car._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                minHeight: '350px',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}
                            onClick={() => setSelectedCar(car._id)}
                        >
                            <CarCard car={car} />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedCar && (
                <BookingForm
                    carId={selectedCar}
                    onBookingSuccess={() => setSelectedCar(null)}
                />
            )}
        </Box>
    );
};

export default CarSearchResultsPage;
