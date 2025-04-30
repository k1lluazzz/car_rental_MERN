import React from 'react';
import { Container, Typography } from '@mui/material';

const HomePage = () => {
    return (
        <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                Welcome to HDOTO
            </Typography>
            {/* The HeroSection component already handles the header and image */}
        </Container>
    );
};

export default HomePage;
