import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper,
    Grid,
    TextField,
    MenuItem,
    Slider,
    Container,
    Divider,
    IconButton,
    Collapse,
    Button
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CarList from '../components/CarList';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

const RentalsPage = () => {
    const [filters, setFilters] = useState({
        priceRange: [0, 5000],
        brand: '',
        transmission: '',
        seats: '',
        fuelType: ''
    });
    const [showFilters, setShowFilters] = useState(true);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            priceRange: [0, 5000],
            brand: '',
            transmission: '',
            seats: '',
            fuelType: ''
        });
    };

    return (
        <Container maxWidth="lg">
            {/* Header Section */}
            <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                borderRadius: 2,
                color: 'white',
                mb: 4
            }}>
                <DriveEtaIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Thuê xe tự lái
                </Typography>
                <Typography variant="subtitle1">
                    Đa dạng lựa chọn xe với giá cả cạnh tranh
                </Typography>
            </Box>

            {/* Filter Section */}
            <Paper 
                sx={{ 
                    p: 3, 
                    mb: 4,
                    borderRadius: 2,
                    boxShadow: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterListIcon /> Bộ lọc tìm kiếm
                    </Typography>
                    <IconButton onClick={() => setShowFilters(!showFilters)}>
                        <FilterListIcon />
                    </IconButton>
                </Box>

                <Collapse in={showFilters}>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Giá thuê (K/ngày)</Typography>
                            <Slider
                                value={filters.priceRange}
                                onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5000}
                                step={100}
                                marks={[
                                    { value: 0, label: '0K' },
                                    { value: 1000, label: '1000K' },
                                    { value: 3000, label: '3000K' },
                                    { value: 5000, label: '5000K' },
                                ]}
                                sx={{
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: '#1976d2',
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: '#1976d2',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="Thương hiệu"
                                fullWidth
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                                variant="outlined"
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
                                variant="outlined"
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
                                variant="outlined"
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
                                variant="outlined"
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="Xăng">Xăng</MenuItem>
                                <MenuItem value="Dầu">Dầu</MenuItem>
                                <MenuItem value="Điện">Điện</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={handleResetFilters}
                                >
                                    Đặt lại
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Collapse>
            </Paper>

            {/* Car List Section */}
            <Box sx={{ mb: 4 }}>
                <CarList filters={filters} />
            </Box>
        </Container>
    );
};

export default RentalsPage;
