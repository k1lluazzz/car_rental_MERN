import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, agreeToTerms: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, confirmPassword, agreeToTerms } = formData;

        // Validate input
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!agreeToTerms) {
            alert('You must agree to the terms and conditions.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                phone,
                password,
            });
            alert('Registration successful! You can now log in.');
            navigate('/login'); // Redirect to the login page after registration
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            if (err.response && err.response.data && err.response.data.message) {
                alert(`Registration failed: ${err.response.data.message}`);
            } else {
                alert('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: '100px auto', padding: '20px', boxShadow: 3, borderRadius: '10px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                Đăng ký
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
                <TextField
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    onChange={handleChange}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.agreeToTerms}
                            onChange={handleCheckboxChange}
                            required
                        />
                    }
                    label="Tôi đã đọc và đồng ý với Chính sách & quy định."
                />
                <Button type="submit" variant="contained" color="success" fullWidth sx={{ mb: 2 }}>
                    Đăng ký
                </Button>
            </form>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Bạn đã có tài khoản?{' '}
                <span
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                >
                    Đăng nhập
                </span>
            </Typography>
        </Box>
    );
};

export default RegisterPage;
