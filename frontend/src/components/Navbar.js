import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Toast from './Toast';

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

    const handleViewRentals = () => {
        navigate('/my-rentals');
        handleMenuClose();
    };

    return (
        <>            <AppBar
            position="fixed"
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
            }}
        >
            <Toolbar>
                <Box
                    sx={{
                        width: '90%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                    }}
                >                        <Typography component={Link} to="/" sx={{ textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img
                                src="./images/logo.jpg"
                                alt="Logo"
                                style={{ height: '50px', borderRadius: '8px' }}
                            />
                        </Box>
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        '& .MuiButton-root': {
                            borderRadius: '8px',
                            padding: '8px 16px',
                            transition: 'all 0.2s ease-in-out',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            }
                        }
                    }}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/about"
                            startIcon={<InfoIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                color: 'white',
                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                            }}
                        >
                            Về HDoto
                        </Button>
                        <Button
                            color="primary"
                            component={Link}
                            to="/rentals"
                            variant="contained"
                            startIcon={<DirectionsCarIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                color: 'white',
                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                            }}
                        >
                            Thuê xe
                        </Button>

                        {/* Add Dashboard Icon for Admin */}
                        {isAdmin && (
                            <IconButton

                                onClick={() => navigate('/admin/dashboard')}
                                sx={{
                                    ml: 1,
                                    '&:hover': {

                                        transform: 'scale(1.1)',
                                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                        color: 'white',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
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
                                </IconButton>                                    <Menu
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
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            borderRadius: '12px',
                                            minWidth: '200px',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                            '& .MuiMenuItem-root': {
                                                padding: '12px 20px',
                                                gap: '12px',
                                                borderRadius: '8px',
                                                margin: '4px',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleViewRentals}>
                                        <ListAltIcon color="primary" fontSize="small" />
                                        Đơn thuê xe
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/profile')}>
                                        <AccountCircleIcon color="primary" fontSize="small" />
                                        Hồ sơ
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/settings')}>
                                        <SettingsIcon color="primary" fontSize="small" />
                                        Cài đặt
                                    </MenuItem>
                                    
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <ExitToAppIcon color="error" fontSize="small" />
                                        Đăng xuất
                                    </MenuItem>
                                </Menu>
                            </Box>) : (
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                '& .MuiButton-root': {
                                    borderRadius: '8px',
                                    padding: '8px 24px',
                                    transition: 'all 0.2s ease-in-out',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                }
                            }}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        borderWidth: '2px',
                                        '&:hover': {
                                            borderWidth: '2px',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </Box>
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
