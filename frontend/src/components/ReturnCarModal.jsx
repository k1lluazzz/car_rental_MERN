import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Rating,
    Alert
} from '@mui/material';
import axios from 'axios';

const ReturnCarModal = ({ open, onClose, rental, onReturn }) => {
    const [returnData, setReturnData] = useState({
        condition: 'good',
        notes: '',
        rating: 5,
        review: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReturnData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setReturnData(prev => ({
            ...prev,
            rating: newValue
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            
            // First return the car
            await axios.post(
                `http://localhost:5000/api/rentals/${rental._id}/return`,
                {
                    condition: returnData.condition,
                    notes: returnData.notes
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Then submit the review
            await axios.post(
                `http://localhost:5000/api/rentals/${rental._id}/review`,
                {
                    rating: returnData.rating,
                    comment: returnData.review
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onReturn();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi trả xe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" fontWeight={600}>
                    Trả xe và Đánh giá
                </Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Thông tin trả xe
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tình trạng xe</InputLabel>
                        <Select
                            name="condition"
                            value={returnData.condition}
                            onChange={handleInputChange}
                            label="Tình trạng xe"
                        >
                            <MenuItem value="excellent">Xuất sắc</MenuItem>
                            <MenuItem value="good">Tốt</MenuItem>
                            <MenuItem value="fair">Trung bình</MenuItem>
                            <MenuItem value="poor">Kém</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        name="notes"
                        label="Ghi chú"
                        value={returnData.notes}
                        onChange={handleInputChange}
                        sx={{ mb: 3 }}
                    />
                </Box>                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Đánh giá trải nghiệm thuê xe
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Bạn cảm thấy thế nào về chuyến đi này?
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Rating
                                name="rating"
                                value={returnData.rating}
                                onChange={handleRatingChange}
                                size="large"
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: '#FFD700',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#FFED4A',
                                    }
                                }}
                            />
                            <Typography 
                                color="text.secondary"
                                sx={{
                                    ml: 1,
                                    fontWeight: returnData.rating ? 500 : 400
                                }}
                            >
                                {returnData.rating === 5 && 'Tuyệt vời'}
                                {returnData.rating === 4 && 'Rất tốt'}
                                {returnData.rating === 3 && 'Bình thường'}
                                {returnData.rating === 2 && 'Không tốt'}
                                {returnData.rating === 1 && 'Tệ'}
                                {!returnData.rating && 'Chưa đánh giá'}
                            </Typography>
                        </Box>
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        name="review"
                        label="Nhận xét của bạn"
                        value={returnData.review}
                        onChange={handleInputChange}
                        placeholder="Chia sẻ trải nghiệm của bạn về xe này..."
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                        color: 'white'
                    }}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReturnCarModal;
