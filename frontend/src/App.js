import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import AboutPage from './pages/AboutPage';

const App = () => {
    const location = useLocation(); // Get the current route

    return (
        <>
            <Navbar />
            {/* Render HeroSection only on the homepage */}
            {location.pathname === '/' && <HeroSection />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rentals" element={<RentalsPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
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
