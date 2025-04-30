import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import axios from 'axios';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/payments/status/${orderId}`);
                setPayment(response.data);
            } catch (error) {
                console.error('Error checking payment status:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            checkPaymentStatus();
        }
    }, [orderId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            maxWidth: 600, 
            margin: '40px auto', 
            textAlign: 'center',
            p: 3 
        }}>
            {payment?.status === 'completed' ? (
                <>
                    <Check sx={{ fontSize: 60, color: 'success.main' }} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Thanh toán thành công!
                    </Typography>
                </>
            ) : (
                <>
                    <Close sx={{ fontSize: 60, color: 'error.main' }} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Thanh toán thất bại!
                    </Typography>
                </>
            )}
            
            <Button 
                variant="contained" 
                onClick={() => navigate('/rentals')}
                sx={{ mt: 3 }}
            >
                Quay lại trang thuê xe
            </Button>
        </Box>
    );
};

export default PaymentStatusPage;
