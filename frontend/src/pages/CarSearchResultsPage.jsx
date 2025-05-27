import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, TextField, MenuItem, Button, Card, Paper, FormControl, InputLabel, Select, Slider } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import axios from 'axios';
import CarCard from '../components/CarCard';
import BookingForm from '../components/BookingForm';

const CarSearchResultsPage = () => {
    const [cars, setCars] = useState([]);
    const [tempFilters, setTempFilters] = useState({
        priceRange: [0, 1000000],
        brand: '',
        transmission: '',
        seats: '',
        fuelType: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        priceRange: [0, 1000000],
        brand: '',
        transmission: '',
        seats: '',
        fuelType: ''
    });

    const [sortBy, setSortBy] = useState('');
    const [sortedCars, setSortedCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const location = useLocation();

    // Extract the location query parameter
    const queryParams = new URLSearchParams(location.search);
    const selectedLocation = queryParams.get('location');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                console.log("Searching for location:", selectedLocation); // Debug log
                const response = await axios.get('http://localhost:5000/api/cars', {
                    params: {
                        location: selectedLocation ? selectedLocation.trim() : ''
                    }
                });
                console.log("API Response:", response.data); // Debug log
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                    setSortedCars(response.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setCars([]);
                    setSortedCars([]);
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
                setCars([]);
                setSortedCars([]);
            }
        };

        fetchCars(); // Remove the condition to always fetch cars
    }, [selectedLocation]);

    useEffect(() => {
        if (cars.length > 0) {
            let filteredResults = cars.filter(car => {
                const matchesBrand = !appliedFilters.brand || car.brand === appliedFilters.brand;
                const matchesTransmission = !appliedFilters.transmission || car.transmission === appliedFilters.transmission;
                const matchesSeats = !appliedFilters.seats || car.seats === parseInt(appliedFilters.seats);
                const matchesFuelType = !appliedFilters.fuelType || car.fuelType === appliedFilters.fuelType;
                const matchesPrice = car.pricePerDay >= appliedFilters.priceRange[0] && car.pricePerDay <= appliedFilters.priceRange[1];
                
                return matchesBrand && matchesTransmission && matchesSeats && matchesFuelType && matchesPrice;
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
        }
    }, [cars, appliedFilters, sortBy]);

    const handleFilterChange = (field, value) => {
        setTempFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApplyFilter = () => {
        setAppliedFilters(tempFilters);
    };

    const handleClearFilter = () => {
        const defaultFilters = {
            priceRange: [0, 1000000],
            brand: '',
            transmission: '',
            seats: '',
            fuelType: ''
        };
        setTempFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
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
                            value={tempFilters.brand}
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
                            value={tempFilters.seats}
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
                            value={tempFilters.transmission}
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
                            value={tempFilters.fuelType}
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
                            value={tempFilters.priceRange}
                            onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000000}
                            step={50000}
                            marks={[
                                { value: 0, label: '0K' },
                                { value: 250000, label: '250K' },
                                { value: 500000, label: '500K' },
                                { value: 750000, label: '750K' },
                                { value: 1000000, label: '1M' },
                            ]}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>{tempFilters.priceRange[0]}K</Typography>
                            <Typography>{tempFilters.priceRange[1]}K</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleApplyFilter}
                                startIcon={<FilterAltIcon />}
                            >
                                Áp dụng bộ lọc
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleClearFilter}
                                startIcon={<ClearAllIcon />}
                            >
                                Xóa bộ lọc
                            </Button>
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
