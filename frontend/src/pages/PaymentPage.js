import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Divider
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import Toast from '../components/Toast';

const PaymentPage = () => {
    const { rentalId } = useParams();
    const [rental, setRental] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const calculateTotalPrice = () => {
        const days = Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24));
        const basePrice = days * rental.car.pricePerDay;
        return rental.car.discount > 0 ? basePrice * (1 - rental.car.discount / 100) : basePrice;
    };

    const originalPrice = () => {
        const days = Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / (1000 * 60 * 60 * 24));
        return days * rental.car.pricePerDay;
    };

    useEffect(() => {
        const fetchRental = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/rentals/${rentalId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRental(response.data);
            } catch (error) {
                setToast({
                    open: true,
                    message: error.response?.data?.message || 'Error loading rental details',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        if (rentalId) {
            fetchRental();
        }
    }, [rentalId]);

    const handlePayment = async (method) => {
        try {
            const response = await axios.post('http://localhost:5000/api/payments/create_payment_url', {
                rentalId,
                amount: calculateTotalPrice(),
                paymentMethod: method
            });
            window.location.href = response.data.paymentUrl;
        } catch (error) {
            setToast({
                open: true,
                message: error.response?.data?.message || 'Payment creation failed',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Thanh toán đơn thuê xe
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Chi tiết đơn hàng
                </Typography>
                <Grid container spacing={2}>
                    {rental && (
                        <>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <DirectionsCarIcon sx={{ mr: 1 }} />
                                    <Typography>
                                        Xe: {rental.car.name} ({rental.car.brand})
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EventIcon sx={{ mr: 1 }} />
                                    <Typography>
                                        Thời gian thuê: {rental.durationInDays} ngày
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarTodayIcon sx={{ mr: 1 }} />
                                    <Typography>
                                        Từ: {new Date(rental.startDate).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarTodayIcon sx={{ mr: 1 }} />
                                    <Typography>
                                        Đến: {new Date(rental.endDate).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" color="primary">
                                    Tổng tiền: {calculateTotalPrice().toLocaleString()} VNĐ
                                </Typography>
                                {rental.car.discount > 0 && (
                                    <>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ textDecoration: 'line-through' }}
                                        >
                                            {originalPrice().toLocaleString()} VNĐ
                                        </Typography>
                                        <Typography variant="body2" color="success.main">
                                            (Giảm {rental.car.discount}%)
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Chọn phương thức thanh toán
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handlePayment('vnpay')}
                            startIcon={<PaymentIcon />}
                        >
                            VNPay
                        </Button>
                    </Grid>
                   {/*  <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handlePayment('momo')}
                            startIcon={<PaymentIcon />}
                            disabled
                        >
                            Momo
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handlePayment('zalopay')}
                            startIcon={<PaymentIcon />}
                            disabled
                        >
                            ZaloPay
                        </Button>
                    </Grid> */}
                </Grid>
            </Paper>

            <Toast
                open={toast.open}
                handleClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                message={toast.message}
            />
        </Box>
    );
};

export default PaymentPage;
