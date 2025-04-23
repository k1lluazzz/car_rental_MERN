import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const App = () => {
    return (
        <Router>
            <Navbar />
            <HeroSection />
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
