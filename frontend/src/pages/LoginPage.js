import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert('Login successful!');
            navigate('/'); // Redirect to the homepage after login
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message); // Debug log
            if (err.response && err.response.data && err.response.data.message) {
                alert(`Login failed: ${err.response.data.message}`);
            } else {
                alert('Login failed. Please try again later.');
            }
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
        </Box>
    );
};

export default LoginPage;
