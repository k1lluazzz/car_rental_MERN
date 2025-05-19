import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, /* MenuItem, */ Modal, Grid, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Toast from './Toast';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ carId, onBookingSuccess }) => {
    const navigate = useNavigate();
    const [timeModalOpen, setTimeModalOpen] = useState(false);
    const [defaultTime, setDefaultTime] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        startDate: new Date(),
        startTime: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        endTime: new Date(),
        duration: '',
    });
    const [rentalType, setRentalType] = useState('day');
    const [isCustomTimeSelected, setIsCustomTimeSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        severity: 'success',
        message: ''
    });
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [car, setCar] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/cars/${carId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCar(response.data);
                // Set the car's location as the selected location
                setSelectedLocation(response.data.location);
            } catch (error) {
                console.error('Error fetching car:', error);
                if (error.response && error.response.status === 401) {
                    setToast({
                        open: true,
                        severity: 'error',
                        message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
                    });
                    // Optional: Redirect to login page
                    // navigate('/login');
                }
            }
        };
        fetchCar();
    }, [carId, navigate]);

    useEffect(() => {
        if (car && selectedOptions.startDate && selectedOptions.endDate) {
            const diffTime = Math.abs(new Date(selectedOptions.endDate) - new Date(selectedOptions.startDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setCalculatedPrice(car.pricePerDay * diffDays);
        }
    }, [car, selectedOptions.startDate, selectedOptions.endDate]);

    const handleOptionChange = (field, value) => {
        setSelectedOptions((prev) => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        const { startDate, startTime, endDate, endTime, duration } = selectedOptions;
        if (rentalType === 'day' && startDate && startTime && endDate && endTime) {
            setDefaultTime(
                `${startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${startDate.toLocaleDateString('en-GB')} - ${endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${endDate.toLocaleDateString('en-GB')}`
            );
            setIsCustomTimeSelected(true);
        } else if (rentalType === 'hour' && startDate && startTime && duration) {
            const startDateTime = new Date(startDate);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));

            setDefaultTime(
                `${startDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${startDateTime.toLocaleDateString('en-GB')} - ${endDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${endDateTime.toLocaleDateString('en-GB')}`
            );
            setIsCustomTimeSelected(true);
        }
        setTimeModalOpen(false);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setToast({
                open: true,
                severity: 'error',
                message: 'Vui lòng đăng nhập để đặt xe'
            });
            // Optional: Redirect to login page
            // navigate('/login');
            return;
        }

        if (!isCustomTimeSelected && !defaultTime) {
            setToast({
                open: true,
                severity: 'error',
                message: 'Vui lòng chọn thời gian thuê xe'
            });
            return;
        }

        setLoading(true);
        try {
            const user = localStorage.getItem('user');
            const userData = JSON.parse(user);
            if (!userData.name) {
                setToast({
                    open: true,
                    severity: 'error',
                    message: 'Không tìm thấy thông tin người dùng'
                });
                return;
            }            const bookingData = {
                car: carId,
                userName: userData.name,
                startDate: selectedOptions.startDate,
                endDate: selectedOptions.endDate,
                location: selectedLocation,
                userId: userData._id // MongoDB uses _id instead of id
            };

            const response = await axios.post('http://localhost:5000/api/rentals/book', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setToast({
                open: true,
                severity: 'success',
                message: 'Đặt xe thành công!'
            });

            // Redirect to payment page with rental ID
            setTimeout(() => {
                navigate(`/payment/${response.data._id}`);
            }, 1500);
        } catch (error) {
            console.error('Booking error:', error);
            setToast({
                open: true,
                severity: 'error',
                message: error.response?.data?.message || 'Đặt xe thất bại'
            });
            
            // Handle token expiration
            if (error.response && error.response.status === 401) {
                setToast({
                    open: true,
                    severity: 'error',
                    message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
                });
                // Optional: Redirect to login page
                // navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ padding: '20px', bgcolor: 'white', borderRadius: '10px', boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Thông tin thuê xe
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ marginBottom: '10px' }}>
                                <LocationOnIcon fontSize="small" /> Địa điểm
                            </Typography>
                            {/* Replace TextField with static display of car location */}
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {car?.location}
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 2 }}>
                            <Typography variant="subtitle1" sx={{ marginBottom: '10px' }}>
                                <CalendarMonthIcon fontSize="small" /> Thời gian thuê
                            </Typography>
                            <TextField
                                fullWidth
                                value={defaultTime || `${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${today.toLocaleDateString('en-GB')} - ${tomorrow.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${tomorrow.toLocaleDateString('en-GB')}`}
                                onClick={() => setTimeModalOpen(true)}
                            />
                        </Box>
                    </Box>

                    {calculatedPrice > 0 && (
                        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                            Tổng tiền: {calculatedPrice.toLocaleString()}K
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !calculatedPrice}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Đang xử lý...' : (isCustomTimeSelected ? 'Xác nhận đặt xe' : 'Vui lòng chọn thời gian thuê')}
                    </Button>
                </Box>

                <Modal open={timeModalOpen} onClose={() => setTimeModalOpen(false)}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'white',
                        borderRadius: '10px',
                        p: 4,
                        minWidth: '300px',
                        maxWidth: '500px'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Thời gian</Typography>
                            <IconButton onClick={() => setTimeModalOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <ToggleButtonGroup
                            value={rentalType}
                            exclusive
                            onChange={(e, newType) => setRentalType(newType)}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        >
                            <ToggleButton value="day" sx={{ flex: 1 }}>Thuê theo ngày</ToggleButton>
                            <ToggleButton value="hour" sx={{ flex: 1 }}>Thuê theo giờ</ToggleButton>
                        </ToggleButtonGroup>

                        {rentalType === 'day' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <DatePicker
                                        label="Ngày nhận xe"
                                        value={selectedOptions.startDate}
                                        onChange={(newValue) => handleOptionChange('startDate', newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TimePicker
                                        label="Thời gian nhận xe"
                                        value={selectedOptions.startTime}
                                        onChange={(newValue) => handleOptionChange('startTime', newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <DatePicker
                                        label="Ngày trả xe"
                                        value={selectedOptions.endDate}
                                        onChange={(newValue) => handleOptionChange('endDate', newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TimePicker
                                        label="Thời gian trả xe"
                                        value={selectedOptions.endTime}
                                        onChange={(newValue) => handleOptionChange('endTime', newValue)}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <DatePicker
                                        label="Ngày bắt đầu"
                                        value={selectedOptions.startDate}
                                        onChange={(newValue) => handleOptionChange('startDate', newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TimePicker
                                        label="Giờ nhận xe"
                                        value={selectedOptions.startTime}
                                        onChange={(newValue) => handleOptionChange('startTime', newValue)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Thời gian thuê (giờ)"
                                        type="number"
                                        fullWidth
                                        value={selectedOptions.duration}
                                        onChange={(e) => handleOptionChange('duration', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleContinue}
                        >
                            Tiếp tục
                        </Button>
                    </Box>
                </Modal>
            </LocalizationProvider>
            <Toast
                open={toast.open}
                handleClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                message={toast.message}
            />
        </>
    );
};

export default BookingForm;