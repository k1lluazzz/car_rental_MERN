import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import CarList from './components/CarList';
import RentalTable from './components/RentalTable';
import UserTable from './components/UserTable';

const App = () => {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Car Rental
                    </Typography>
                    <Button color="inherit" href="/">Home</Button>
                    <Button color="inherit" href="/rentals">Rentals</Button>
                    <Button color="inherit" href="/users">Users</Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px' }}>
                <Routes>
                    <Route path="/" element={<CarList />} />
                    <Route path="/rentals" element={<RentalTable />} />
                    <Route path="/users" element={<UserTable />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
