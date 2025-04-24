import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null); // Store logged-in user info
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for dropdown menu
    const navigate = useNavigate();

    useEffect(() => {
        // Function to update user state from localStorage
        const updateUser = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        // Update user state on component mount
        updateUser();

        // Listen for changes in localStorage
        window.addEventListener('storage', updateUser);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('storage', updateUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('user'); // Remove user info from localStorage
        setUser(null);
        alert('Logged out successfully!');
        navigate('/'); // Redirect to the homepage
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget); // Open dropdown menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close dropdown menu
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
                            <Typography color="text.secondary" sx={{ padding: '0 10px' }}>
                                |
                            </Typography>
                            {user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <IconButton onClick={handleMenuOpen}>
                                        <Avatar src={user.avatar} alt={user.name} />
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
        </>
    );
};

export default Navbar;
