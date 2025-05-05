import React, { useEffect, useState, useCallback } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Typography,
    Chip,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RentalList = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuthError = useCallback((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [navigate]);

    const fetchRentals = useCallback(async () => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/rentals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRentals(response.data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
            handleAuthError(error);
            setError('Không thể tải danh sách đơn thuê');
        } finally {
            setLoading(false);
        }
    }, [navigate, handleAuthError]);

    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

    const handleUpdateStatus = async (rentalId, newStatus) => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/rentals/${rentalId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRentals();
        } catch (error) {
            console.error('Error updating rental status:', error);
            handleAuthError(error);
            setError('Không thể cập nhật trạng thái đơn thuê');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return <Typography>Đang tải...</Typography>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Người thuê</TableCell>
                        <TableCell>Xe</TableCell>
                        <TableCell>Ngày bắt đầu</TableCell>
                        <TableCell>Ngày kết thúc</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rentals.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Typography>Không có đơn thuê nào</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rentals.map(rental => (
                            <TableRow key={rental._id}>
                                <TableCell>{rental.userName}</TableCell>
                                <TableCell>{rental.car?.name || 'N/A'}</TableCell>
                                <TableCell>{new Date(rental.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>{new Date(rental.endDate).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>{rental.totalAmount?.toLocaleString()}đ</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={rental.status || 'pending'} 
                                        color={getStatusColor(rental.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {rental.status === 'pending' && (
                                        <>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleUpdateStatus(rental._id, 'completed')}
                                                sx={{ mr: 1 }}
                                            >
                                                Xác nhận
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleUpdateStatus(rental._id, 'cancelled')}
                                            >
                                                Hủy
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RentalList;
