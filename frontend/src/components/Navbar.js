import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Toast from './Toast';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Navbar = () => {
    const { user, updateUser } = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Kiểm tra nếu user là admin
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        updateUser(null);
        localStorage.removeItem('token');
        setAnchorEl(null);
        setToast({
            open: true,
            message: 'Đăng xuất thành công!',
            severity: 'success'
        });
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="fixed" color="transparent" elevation={0}>
                <Toolbar sx={{ padding: '0', backgroundColor: 'white', zIndex: 1100 }}>
                    <Box
                        sx={{
                            width: '80%',
                            maxWidth: '1200px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h6">
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <img
                                    src="./images/logo.jpg"
                                    srcSet="./images/logo@2x.jpg 2x, ./images/logo@3x.jpg 3x"
                                    alt="Logo"
                                    style={{ height: '80px' }}
                                />
                            </Link>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Button color="inherit" component={Link} to="/about">
                                Về HDoto
                            </Button>
                            <Button color="inherit" component={Link} to="/rentals">
                                Thuê xe
                            </Button>

                            {/* Add Dashboard Icon for Admin */}
                            {isAdmin && (
                                <IconButton
                                    color="inherit"
                                    onClick={() => navigate('/admin/dashboard')}
                                    sx={{ 
                                        ml: 1,
                                        '&:hover': { 
                                            color: 'primary.main',
                                            transform: 'scale(1.1)' 
                                        }
                                    }}
                                >
                                    <DashboardIcon />
                                </IconButton>
                            )}

                            <Typography color="text.secondary" sx={{ padding: '0 10px' }}>
                                |
                            </Typography>
                            {user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <IconButton 
                                        onClick={handleMenuOpen}
                                        sx={{ 
                                            padding: '4px',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    >
                                        <Avatar 
                                            src={user.avatar} 
                                            alt={user.name}
                                            sx={{ 
                                                width: 40, 
                                                height: 40,
                                                border: '2px solid #fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                      
                                        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                                        <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <>
                                    <Button color="inherit" onClick={() => navigate('/login')}>
                                        Đăng nhập
                                    </Button>
                                    <Button color="inherit" onClick={() => navigate('/register')}>
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toast
                open={toast.open}
                handleClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                message={toast.message}
            />
        </>
    );
};

export default Navbar;
