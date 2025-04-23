import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginModal = ({ open, onClose, onRegisterClick }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add login logic here
        console.log(credentials);
    };

    return (
        <>
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
                        <Typography variant="h6">Đăng nhập</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Số điện thoại hoặc email"
                            name="email"
                            type="email"
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
                        <Typography
                            variant="body2"
                            sx={{ mb: 2, textAlign: 'right', color: 'blue', cursor: 'pointer' }}
                            onClick={() => setForgotPasswordOpen(true)}
                        >
                            Quên mật khẩu?
                        </Typography>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                            Đăng nhập
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Bạn chưa là thành viên?{' '}
                        <span
                            style={{ color: 'blue', cursor: 'pointer' }}
                            onClick={() => {
                                onClose();
                                onRegisterClick();
                            }}
                        >
                            Đăng ký ngay
                        </span>
                    </Typography>
                </Box>
            </Modal>
            <ForgotPasswordModal
                open={isForgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
            />
        </>
    );
};

export default LoginModal;
