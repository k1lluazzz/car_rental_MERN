import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, TextField, MenuItem, Button } from '@mui/material';
import axios from 'axios';
import CarCard from '../components/CarCard';

const CarSearchResultsPage = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        fuelType: '',
        seats: '',
    });
    const [appliedFilters, setAppliedFilters] = useState({
        fuelType: '',
        seats: '',
    });
    const location = useLocation();

    // Extract the location query parameter
    const queryParams = new URLSearchParams(location.search);
    const selectedLocation = queryParams.get('location');

    useEffect(() => {
        // Fetch cars based on the selected location and applied filters
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/cars', {
                    params: {
                        location: selectedLocation,
                        fuelType: appliedFilters.fuelType,
                        seats: appliedFilters.seats,
                    },
                });
                setCars(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCars();
    }, [selectedLocation, appliedFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters); // Apply the selected filters
    };

    const handleClearFilters = () => {
        setFilters({ fuelType: '', seats: '' });
        setAppliedFilters({ fuelType: '', seats: '' }); // Clear applied filters
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                Xe tại khu vực: {selectedLocation}
            </Typography>
            {/* Filter Bar */}
            <Box
                sx={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <TextField
                    label="Loại nhiên liệu"
                    name="fuelType"
                    select
                    value={filters.fuelType}
                    onChange={handleFilterChange}
                    variant="outlined"
                    sx={{ minWidth: '200px' }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Gasoline">Xăng</MenuItem>
                    <MenuItem value="Diesel">Dầu</MenuItem>
                    <MenuItem value="Electric">Điện</MenuItem>
                </TextField>
                <TextField
                    label="Số chỗ ngồi"
                    name="seats"
                    select
                    value={filters.seats}
                    onChange={handleFilterChange}
                    variant="outlined"
                    sx={{ minWidth: '200px' }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="4">4 chỗ</MenuItem>
                    <MenuItem value="7">7 chỗ</MenuItem>
                    <MenuItem value="16">16 chỗ</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" onClick={handleApplyFilters}>
                    Lọc
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
                    Xóa bộ lọc
                </Button>
            </Box>
            {/* Car List */}
            <Grid container spacing={3}>
                {cars.map((car) => (
                    <Grid item xs={12} sm={6} md={4} key={car._id}>
                        <CarCard car={car} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CarSearchResultsPage;
