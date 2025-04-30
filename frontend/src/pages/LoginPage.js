import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    InputAdornment, 
    IconButton,
    Paper,
    Divider,
    Link,
    Container
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff,
    Email,
    Lock,
    Google,
    Facebook 
} from '@mui/icons-material';
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
        <Container maxWidth="xs">
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
                    Đăng nhập
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange}
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
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 2, 
                            mb: 2, 
                            py: 1.2,
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Đăng nhập
                    </Button>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Link href="#" underline="hover" sx={{ fontSize: '0.875rem' }}>
                            Quên mật khẩu?
                        </Link>
                        <Link 
                            onClick={() => navigate('/register')} 
                            sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                            underline="hover"
                        >
                            Đăng ký tài khoản mới
                        </Link>
                    </Box>

                    <Divider sx={{ my: 2 }}>
                        <Typography color="text.secondary" sx={{ px: 1 }}>
                            Hoặc đăng nhập với
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

export default LoginPage;
