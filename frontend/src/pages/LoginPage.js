import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import { useUser } from '../contexts/UserContext';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const { updateUser } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Login request payload:', credentials); // Debug log
            if (!credentials.email || !credentials.password) {
                alert('Email and password are required.');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/users/login', {
                email: credentials.email,
                password: credentials.password,
            });

            console.log('Login response:', response.data); // Debug log
            localStorage.setItem('token', response.data.token);
            updateUser(response.data.user); // Update user context

            setToast({
                open: true,
                message: 'Đăng nhập thành công!',
                severity: 'success'
            });

            // Delay navigation to show toast
            setTimeout(() => {
                if (location.state?.from) {
                    navigate(location.state.from);
                } else {
                    navigate(-1);
                }
            }, 1000);
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message); // Debug log
            setToast({
                open: true,
                message: err.response?.data?.message || 'Đăng nhập thất bại',
                severity: 'error'
            });
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: '100px auto', padding: '20px', boxShadow: 3, borderRadius: '10px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                Đăng nhập
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
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
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    onChange={handleChange}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ mb: 2 }}>
                    Đăng nhập
                </Button>
            </form>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Bạn chưa là thành viên?{' '}
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => navigate('/register')}
                >
                    Đăng ký ngay
                </span>
            </Typography>
            <Toast
                open={toast.open}
                handleClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                message={toast.message}
            />
        </Box>
    );
};

export default LoginPage;
