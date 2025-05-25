import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Modal, Grid, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
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
    const [loading, setLoading] = useState(true);
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
                setSelectedLocation(response.data.location);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching car:', error);
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    setToast({
                        open: true,
                        severity: 'error',
                        message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
                    });
                } else {
                    setToast({
                        open: true,
                        severity: 'error',
                        message: 'Không thể tải thông tin xe'
                    });
                }
            }
        };
        fetchCar();
    }, [carId]);

    const calculatePrice = useCallback(() => {
        if (!car || !selectedOptions.startDate || !selectedOptions.endDate) return 0;
        const days = Math.ceil((selectedOptions.endDate - selectedOptions.startDate) / (1000 * 60 * 60 * 24));
        const basePrice = days * car.pricePerDay;
        return car.discount > 0 ? basePrice * (1 - car.discount / 100) : basePrice;
    }, [selectedOptions.startDate, selectedOptions.endDate, car]);

    const originalPrice = useCallback(() => {
        if (!car || !selectedOptions.startDate || !selectedOptions.endDate) return 0;
        const days = Math.ceil((selectedOptions.endDate - selectedOptions.startDate) / (1000 * 60 * 60 * 24));
        return days * car.pricePerDay;
    }, [selectedOptions.startDate, selectedOptions.endDate, car]);

    useEffect(() => {
        if (car && selectedOptions.startDate && selectedOptions.endDate) {
            setCalculatedPrice(calculatePrice());
        }
    }, [car, selectedOptions.startDate, selectedOptions.endDate, calculatePrice]);

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
            }            // Calculate duration in days
            const startDate = new Date(selectedOptions.startDate);
            const endDate = new Date(selectedOptions.endDate);
            startDate.setHours(selectedOptions.startTime.getHours(), selectedOptions.startTime.getMinutes());
            endDate.setHours(selectedOptions.endTime.getHours(), selectedOptions.endTime.getMinutes());
            
            const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const originalPriceValue = durationInDays * car.pricePerDay;
            const totalPriceValue = car.discount ? Math.floor(originalPriceValue * (1 - car.discount / 100)) : originalPriceValue;

            const bookingData = {
                car: carId,
                userName: userData.name,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                location: selectedLocation,
                userId: userData._id,
                originalPrice: originalPriceValue,
                totalPrice: totalPriceValue,
                totalAmount: totalPriceValue,
                durationInDays,
                discount: car.discount || 0
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
            
            if (error.response && error.response.status === 401) {
                setToast({
                    open: true,
                    severity: 'error',
                    message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
                });
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
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {car?.location || 'Đang tải...'}
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

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Chi phí thuê:</Typography>
                        {loading ? (
                            <Typography variant="body1">Đang tải...</Typography>
                        ) : !car ? (
                            <Typography variant="body1">Không tìm thấy thông tin xe</Typography>
                        ) : (
                            <>
                                {car.discount > 0 ? (
                                    <>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary" 
                                            sx={{ textDecoration: 'line-through' }}
                                        >
                                            {originalPrice().toLocaleString()}K VND
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            {calculatePrice().toLocaleString()}K VND
                                        </Typography>
                                        <Typography variant="body2" color="success.main">
                                            (Giảm {car.discount}%)
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="h6">
                                        {calculatePrice().toLocaleString()}K VND
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !car || !calculatedPrice}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Đang tải...' : !car ? 'Không tìm thấy thông tin xe' : (isCustomTimeSelected ? 'Xác nhận đặt xe' : 'Vui lòng chọn thời gian thuê')}
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
                            onChange={(e, newType) => newType && setRentalType(newType)}
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
                                        minDate={selectedOptions.startDate}
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