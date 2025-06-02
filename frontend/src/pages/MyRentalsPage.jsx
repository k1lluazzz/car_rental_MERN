import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { CheckCircle, DirectionsCar, Star } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import ReturnCarModal from '../components/ReturnCarModal';

const MyRentalsPage = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRental, setSelectedRental] = useState(null);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                if (!user) {
                    navigate('/login');
                    return;
                }
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                console.log('Fetching rentals with token:', token);
                const response = await axios.get('http://localhost:5000/api/rentals/my-rentals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Received rentals:', response.data);
                setRentals(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rentals:', error);
                console.error('Error response:', error.response);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Không thể tải danh sách đơn thuê: ' + (error.response?.data?.message || error.message));
                }
                setLoading(false);
            }
        };
        fetchRentals();
    }, [navigate, user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            case 'unpaid':
                return 'default';
            case 'returned':
                return 'info';
            default:
                return 'default';
        }
    };

    const handleReturn = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/rentals/my-rentals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRentals(response.data);
        } catch (error) {
            setError('Không thể cập nhật danh sách thuê xe');
        }
    };

    const handleReturnClick = (rental) => {
        setSelectedRental(rental);
        setReturnModalOpen(true);
    };    const handleChangeCar = (selectedRental) => {
        if (!selectedRental) {
            console.error('No rental selected');
            return;
        }
        const params = new URLSearchParams({
            startDate: selectedRental.startDate,
            endDate: selectedRental.endDate,
            location: selectedRental.car?.location || '',
            rentalId: selectedRental._id // Added rental ID
        });
        console.log('Navigating with params:', params.toString());
        navigate(`/cars?${params.toString()}`);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Đã thanh toán';
            case 'pending':
                return 'Chờ xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            case 'unpaid':
                return 'Chưa thanh toán';
            case 'returned':
                return 'Đã trả xe';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Lịch sử thuê xe
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer 
                component={Paper} 
                sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Xe</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ngày kết thúc</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tổng tiền</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rentals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography>Bạn chưa có đơn thuê xe nào</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rentals.map((rental) => (
                                <TableRow key={rental._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {rental.car?.image && (
                                                <img
                                                    src={rental.car.image}
                                                    alt={rental.car.name}
                                                    style={{
                                                        width: 60,
                                                        height: 40,
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            )}
                                            <Typography variant="subtitle1">
                                                {rental.car?.name || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </TableCell>                                    <TableCell>
                                        {new Date(rental.startDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(rental.endDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        {rental.discount > 0 ? (
                                            <Box>
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary" 
                                                    sx={{ textDecoration: 'line-through' }}
                                                >
                                                    {rental.originalPrice?.toLocaleString()}đ
                                                </Typography>
                                                <Typography variant="body1" color="primary">
                                                    {rental.totalPrice?.toLocaleString()}đ
                                                </Typography>
                                                <Typography variant="caption" color="success.main">
                                                    (Giảm {rental.discount}%)
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography>
                                                {rental.totalAmount?.toLocaleString()}đ
                                            </Typography>
                                        )}
                                        
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusText(rental.status)}
                                            color={getStatusColor(rental.status)}
                                            size="small"
                                        />
                                    </TableCell>                                    <TableCell>
                                        {rental.status === 'completed' && (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<DirectionsCar />}
                                                onClick={() => handleReturnClick(rental)}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                Trả xe
                                            </Button>
                                        )}
                                        {rental.status === 'unpaid' && (                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleChangeCar(rental)}
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    Chọn xe khác
                                                </Button>                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => navigate(`/payment/${rental._id}?source=carchange`)}
                                                    sx={{ borderRadius: '8px' }}
                                                >
                                                    Thanh toán
                                                </Button>
                                            </Box>
                                        )}
                                        {rental.status === 'returned' && !rental.review && (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<Star />}
                                                onClick={() => handleReturnClick(rental)}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                Đánh giá
                                            </Button>
                                        )}
                                        {rental.status === 'returned' && rental.review && (
                                            <Chip
                                                icon={<CheckCircle sx={{ color: 'success.main' }} />}
                                                label="Đã đánh giá"
                                                variant="outlined"
                                                color="success"
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ReturnCarModal
                open={returnModalOpen}
                onClose={() => {
                    setReturnModalOpen(false);
                    setSelectedRental(null);
                }}
                rental={selectedRental}
                onReturn={handleReturn}
            />
        </Container>
    );
};

export default MyRentalsPage;
