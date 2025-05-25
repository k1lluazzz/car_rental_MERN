import React from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const PaymentForm = ({ rental, onSuccess }) => {
    const [loading, setLoading] = React.useState(false);

    // Calculate discounted amount
    const calculateFinalAmount = () => {
        const originalAmount = rental.totalAmount;
        if (rental.car && rental.car.discount > 0) {
            const discountAmount = (originalAmount * rental.car.discount) / 100;
            return originalAmount - discountAmount;
        }
        return originalAmount;
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const finalAmount = calculateFinalAmount();
            const response = await axios.post('http://localhost:5000/api/payments/create_payment_url', {
                rentalId: rental._id,
                amount: finalAmount,
                originalAmount: rental.totalAmount,
                discount: rental.car?.discount || 0
            });
            
            // Redirect to VNPay payment URL
            window.location.href = response.data.paymentUrl;
        } catch (error) {
            console.error('Payment error:', error);
            alert('Không thể tạo thanh toán. Vui lòng thử lại.');
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
