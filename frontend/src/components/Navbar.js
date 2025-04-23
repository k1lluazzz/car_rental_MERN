import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Login from './Login'; // Updated import
import Register from './Register'; // Updated import

const Navbar = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar sx={{ padding: '0 20px' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <img src="src/logo.png" alt="Logo" style={{ height: '40px' }} />
                        </Link>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Button color="inherit">Về chúng tôi</Button>
                        <Button color="inherit">Thuê xe</Button>
                        <Typography color="text.secondary" sx={{ padding: '0 10px' }}>|</Typography>
                        <Button color="inherit" onClick={() => setLoginOpen(true)}>
                            Đăng nhập
                        </Button>
                        <Button color="inherit" onClick={() => setRegisterOpen(true)}>
                            Đăng ký
                        </Button>
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
