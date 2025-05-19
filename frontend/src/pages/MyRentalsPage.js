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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const MyRentalsPage = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    const navigate = useNavigate();
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
        };        fetchRentals();
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
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Đã hoàn thành';
            case 'pending':
                return 'Chờ xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            case 'unpaid':
                return 'Chưa thanh toán';
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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Đơn thuê xe của tôi
            </Typography>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên xe</TableCell>
                            <TableCell>Ngày bắt đầu</TableCell>
                            <TableCell>Ngày kết thúc</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rentals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>Bạn chưa có đơn thuê xe nào</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rentals.map(rental => (
                                <TableRow key={rental._id}>                                    <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {rental.car?.image && (
                                            <img
                                                src={rental.car.image}
                                                alt={rental.car.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        )}
                                        <Typography>{rental.car?.name || 'N/A'}</Typography>
                                    </Box>
                                </TableCell>
                                    <TableCell>{new Date(rental.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{new Date(rental.endDate).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>{rental.totalAmount?.toLocaleString()}đ</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={getStatusText(rental.status)}
                                                color={getStatusColor(rental.status)}
                                                size="small"
                                            />
                                            {rental.status === 'unpaid' && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => navigate(`/payment/${rental._id}`)}
                                                >
                                                    Thanh toán
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default MyRentalsPage;
