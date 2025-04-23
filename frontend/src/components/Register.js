import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RegisterModal = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        password: '',
        confirmPassword: '',
        referralCode: '',
        agreeToTerms: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, agreeToTerms: e.target.checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add registration logic here
        console.log(formData);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'white',
                    borderRadius: '10px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Đăng ký</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Số điện thoại"
                        name="phone"
                        type="text"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Tên hiển thị"
                        name="name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Mã giới thiệu (nếu có)"
                        name="referralCode"
                        type="text"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.agreeToTerms}
                                onChange={handleCheckboxChange}
                                required
                            />
                        }
                        label={
                            <Typography variant="body2">
                                Tôi đã đọc và đồng ý với{' '}
                                <span style={{ color: 'blue', cursor: 'pointer' }}>Chính sách & quy định</span> và{' '}
                                <span style={{ color: 'blue', cursor: 'pointer' }}>Chính sách bảo vệ dữ liệu cá nhân</span>.
                            </Typography>
                        }
                    />
                    <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                        Đăng ký
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default RegisterModal;
