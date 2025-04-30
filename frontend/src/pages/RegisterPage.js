import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Checkbox, 
    FormControlLabel, 
    InputAdornment, 
    IconButton, 
    Container, 
    Link, 
    Paper, 
    Divider 
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Phone,
    Lock,
    Google,
    Facebook
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';

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
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
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
            await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                phone,
                password,
            });
            
            setToast({
                open: true,
                message: 'Đăng ký thành công! Đang chuyển hướng...',
                severity: 'success'
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setToast({
                open: true,
                message: err.response?.data?.message || 'Đăng ký thất bại',
                severity: 'error'
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    mt: 8,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Đăng ký tài khoản
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Họ tên"
                        name="name"
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Mật khẩu"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
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
                        label="Tôi đã đọc và đồng ý với Chính sách & quy định."
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            py: 1.2,
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Đăng ký
                    </Button>

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Link 
                            onClick={() => navigate('/login')}
                            sx={{ cursor: 'pointer' }}
                            underline="hover"
                        >
                            Đã có tài khoản? Đăng nhập
                        </Link>
                    </Box>

                    <Divider sx={{ my: 2 }}>
                        <Typography color="text.secondary" sx={{ px: 1 }}>
                            Hoặc đăng ký với
                        </Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            sx={{ py: 1 }}
                        >
                            Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Facebook />}
                            sx={{ py: 1 }}
                        >
                            Facebook
                        </Button>
                    </Box>
                </form>
            </Paper>
            <Toast
                open={toast.open}
                handleClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                message={toast.message}
            />
        </Container>
    );
};

export default RegisterPage;
