import React from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const PaymentForm = ({ rental, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/payments/create_payment_url', {
                rentalId: rental._id,
                amount: rental.totalAmount
            });
            
            // Redirect to VNPay payment URL
            window.location.href = response.data.paymentUrl;
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment creation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Thanh toán đơn thuê xe
            </Typography>
            <Typography gutterBottom>
                Số tiền: {rental.totalAmount.toLocaleString()} VNĐ
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                disabled={loading}
                fullWidth
            >
                {loading ? <CircularProgress size={24} /> : 'Thanh toán qua VNPay'}
            </Button>
        </Box>
    );
};

export default PaymentForm;
