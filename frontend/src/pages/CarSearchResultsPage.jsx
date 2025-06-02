import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Grid, 
    TextField, 
    MenuItem, 
    Button, 
    Card, 
    Paper, 
    FormControl, 
    InputLabel, 
    Select, 
    Slider,
    CircularProgress,
    Alert,
    AlertTitle,
    Snackbar,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogActions
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
    const [dateTimeOpen, setDateTimeOpen] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [newDates, setNewDates] = useState({
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null
    });

    const [sortBy, setSortBy] = useState('');
    const [sortedCars, setSortedCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const location = useLocation();
    const navigate = useNavigate();

    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const selectedLocation = queryParams.get('location');
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const rentalId = queryParams.get('rentalId'); // Added to handle car changes

    // Tính thời gian thuê
    const calculateRentalDuration = () => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        return hours >= 24 ? Math.ceil(hours / 24) + ' ngày' : hours + ' giờ';
    };

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5000/api/cars', {
                    params: {
                        location: selectedLocation ? selectedLocation.trim() : '',
                        startDate: startDate,
                        endDate: endDate
                    }
                });
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                    setSortedCars(response.data);
                } else {
                    throw new Error('Invalid response format from server');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching available cars');
                setCars([]);
                setSortedCars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [selectedLocation, startDate, endDate]);

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

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const rentalDuration = calculateRentalDuration();
    const searchTimeInfo = startDate && endDate ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
                Thông tin thuê xe
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
                <strong>Thời gian thuê:</strong> {rentalDuration}
            </Typography>
            <Typography variant="body1" align="center">
                <strong>Từ:</strong> {formatDateTime(startDate)}
            </Typography>
            <Typography variant="body1" align="center">
                <strong>Đến:</strong> {formatDateTime(endDate)}
            </Typography>
        </Paper>
    ) : null;

    const handleCarSelection = async (carId) => {
        if (rentalId) {
            setSelectedCarId(carId);
            setNewDates({
                startDate: startDate ? new Date(startDate) : new Date(),
                startTime: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: endDate ? new Date(endDate) : new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            setDateTimeOpen(true);
        } else {
            setSelectedCar(carId);
        }
    };

    const handleDateChange = (field, value) => {
        setNewDates(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirmChange = async () => {
        try {
            const startDateTime = new Date(newDates.startDate);
            const endDateTime = new Date(newDates.endDate);
            
            startDateTime.setHours(
                newDates.startTime.getHours(),
                newDates.startTime.getMinutes()
            );
            
            endDateTime.setHours(
                newDates.endTime.getHours(),
                newDates.endTime.getMinutes()
            );

            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/rentals/${rentalId}/change-car`, 
                {
                    carId: selectedCarId,
                    startDate: startDateTime.toISOString(),
                    endDate: endDateTime.toISOString()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setToast({
                open: true,
                message: 'Xe và thời gian thuê đã được thay đổi thành công. Vui lòng tiếp tục thanh toán.',
                severity: 'success'
            });

            // Close dialog and redirect
            setDateTimeOpen(false);
            setTimeout(() => {
                navigate('/my-rentals');
            }, 2000);
        } catch (error) {
            setToast({
                open: true,
                message: error.response?.data?.message || 'Có lỗi khi thay đổi xe. Vui lòng thử lại.',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '50vh'
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Đang tìm xe có sẵn...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    Xe tại khu vực: {selectedLocation}
                </Typography>
                
                {searchTimeInfo}
                
                <Dialog open={dateTimeOpen} onClose={() => setDateTimeOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Chọn thời gian thuê mới</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày nhận xe"
                                    value={newDates.startDate}
                                    onChange={(value) => handleDateChange('startDate', value)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Giờ nhận xe"
                                    value={newDates.startTime}
                                    onChange={(value) => handleDateChange('startTime', value)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày trả xe"
                                    value={newDates.endDate}
                                    onChange={(value) => handleDateChange('endDate', value)}
                                    minDate={newDates.startDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Giờ trả xe"
                                    value={newDates.endTime}
                                    onChange={(value) => handleDateChange('endTime', value)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDateTimeOpen(false)}>Hủy bỏ</Button>
                        <Button onClick={handleConfirmChange} variant="contained" color="primary">
                            Xác nhận thay đổi
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={toast.open}
                    autoHideDuration={6000}
                    onClose={() => setToast({ ...toast, open: false })}
                >
                    <Alert 
                        onClose={() => setToast({ ...toast, open: false })} 
                        severity={toast.severity}
                        sx={{ width: '100%' }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        {sortedCars.length > 0 
                            ? `Tìm thấy ${sortedCars.length} xe ${startDate && endDate ? 'có sẵn trong thời gian đã chọn' : ''}`
                            : 'Không tìm thấy xe phù hợp'}
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

                {sortedCars.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Không tìm thấy xe phù hợp với thời gian đã chọn
                        </Typography>
                        <Typography color="text.secondary">
                            Vui lòng thử lại với thời gian khác hoặc điều chỉnh bộ lọc
                        </Typography>
                    </Paper>
                ) : (
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
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3
                                        }
                                    }}
                                    onClick={() => handleCarSelection(car._id)}
                                >
                                    <CarCard 
                                        car={car} 
                                        selectedStartDate={startDate}
                                        selectedEndDate={endDate}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {selectedCar && !rentalId && (
                    <BookingForm
                        carId={selectedCar}
                        startDate={startDate}
                        endDate={endDate}
                        onBookingSuccess={() => setSelectedCar(null)}
                    />
                )
            }
        </Box>
    </LocalizationProvider>
    );
};

export default CarSearchResultsPage;
