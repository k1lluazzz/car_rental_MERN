import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper,
    Grid,
    TextField,
    MenuItem,
    Slider
} from '@mui/material';
import CarList from '../components/CarList';

const RentalsPage = () => {
    const [filters, setFilters] = useState({
        priceRange: [0, 2000],
        brand: '',
        transmission: '',
        seats: '',
        fuelType: ''
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ margin: '40px auto 20px', textAlign: 'center' }}>
                Danh sách xe hiện có
            </Typography>

            {/* Filter Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Bộ lọc tìm kiếm
                </Typography>
                <Grid container spacing={3}>
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
                </Grid>
            </Paper>

            {/* Car List with filters */}
            <CarList filters={filters} />
        </Box>
    );
};

export default RentalsPage;
