import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarSearchResultsPage from './pages/CarSearchResultsPage';

const App = () => {
    const location = useLocation(); // Get the current route

    return (
        <>
            <Navbar />
            {/* Add a top margin to account for the Navbar height */}
            <div style={{ marginTop: '80px' }}>
                {/* Render HeroSection only on the homepage */}
                {location.pathname === '/' && <HeroSection />}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/rentals" element={<RentalsPage />} />
                    <Route path="/cars" element={<CarSearchResultsPage />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
