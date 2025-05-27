import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { Check, Close, ReportProblem } from '@mui/icons-material';
import axios from 'axios';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const orderId = searchParams.get('orderId');
    const hasError = searchParams.get('error') === '1';
    const errorParam = searchParams.get('message');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                if (hasError) {
                    setError(true);
                    setErrorMessage(getErrorMessage(errorParam));
                    setLoading(false);
                    return;
                }

                if (!orderId) {
                    setError(true);
                    setErrorMessage('Không tìm thấy mã đơn hàng');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/payments/status/${orderId}`);
                if (!response.data) {
                    throw new Error('Không tìm thấy thông tin thanh toán');
                }
                console.log('Payment status response:', response.data);
                setPayment(response.data);
            } catch (error) {
                console.error('Error checking payment status:', error);
                setError(true);
                setErrorMessage(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        const getErrorMessage = (code) => {
            switch (code) {
                case 'payment_failed':
                    return 'Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
                case 'rental_not_found':
                    return 'Không tìm thấy thông tin đơn hàng. Vui lòng liên hệ với chúng tôi để được hỗ trợ.';
                case 'Invalid signature':
                    return 'Chữ ký xác thực không hợp lệ. Vui lòng thử lại giao dịch.';
                default:
                    return errorParam 
                        ? decodeURIComponent(errorParam)
                        : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.';
            }
        };

        checkPaymentStatus();
    }, [orderId, hasError, errorParam]);

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
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                }}
            >
                {error || hasError ? (
                    <>
                        <ReportProblem sx={{ fontSize: 60, color: 'error.main' }} />
                        <Typography variant="h5" sx={{ mt: 2, color: 'error.main' }}>
                            Thanh toán thất bại!
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
                            {errorMessage}
                        </Typography>
                    </>
                ) : payment?.status === 'completed' ? (
                    <>
                        <Check sx={{ fontSize: 60, color: 'success.main' }} />
                        <Typography variant="h5" sx={{ mt: 2, color: 'success.main' }}>
                            Thanh toán thành công!
                        </Typography>
                        <Box sx={{ mt: 2, mb: 3 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Mã giao dịch: {payment.orderId}
                            </Typography>
                            {payment.rental && (
                                <>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Xe: {payment.rental.car.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Thời gian thuê: {new Date(payment.rental.startDate).toLocaleDateString('vi-VN')} - {new Date(payment.rental.endDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                                        Chi tiết đơn hàng đã được gửi đến email của bạn
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                ) : (
                    <>
                        <Close sx={{ fontSize: 60, color: 'error.main' }} />
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Thanh toán thất bại!
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
                            Giao dịch không thành công. Vui lòng thử lại.
                        </Typography>
                    </>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/my-rentals')}
                    >
                        Xem đơn hàng của tôi
                    </Button>
                    {(error || hasError) && (
                        <Button 
                            variant="outlined" 
                            onClick={() => window.history.back()}
                        >
                            Thử lại
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentStatusPage;
