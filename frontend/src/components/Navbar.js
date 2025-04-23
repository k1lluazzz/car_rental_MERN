import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Login from './Login'; 
import Register from './Register'; 

const Navbar = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ padding: '0' }}>
                    <Box
                        sx={{
                            width: '80%', // 8/10 of the screen width
                            maxWidth: '1200px', // Optional max width
                            margin: '0 auto', // Center the content
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
                            <Button color="inherit" component={Link} to="/about"> {/* Add navigation */}
                                Về HDoto
                            </Button>
                            <Button color="inherit" component={Link} to="/rentals"> {/* Add navigation */}
                                Thuê xe
                            </Button>
                            <Typography color="text.secondary" sx={{ padding: '0 10px' }}>|</Typography>
                            <Button color="inherit" onClick={() => setLoginOpen(true)}>
                                Đăng nhập
                            </Button>
                            <Button color="inherit" onClick={() => setRegisterOpen(true)}>
                                Đăng ký
                            </Button>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Login
                open={isLoginOpen}
                onClose={() => setLoginOpen(false)}
                onRegisterClick={() => setRegisterOpen(true)}
            />
            <Register open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
        </>
    );
};

export default Navbar;
