import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { UserProvider, useUser } from './contexts/UserContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarSearchResultsPage from './pages/CarSearchResultsPage';
import CarDetailPage from './pages/CarDetailPage';
import DashboardPage from './pages/DashboardPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import PaymentPage from './pages/PaymentPage';

// Protected Route Component
const AdminRoute = ({ children }) => {
    const { user } = useUser();
    const location = useLocation();

    if (!user) {
        // Save attempted location to redirect back after login
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Main App Component
const AppContent = () => {
    const location = useLocation();

    return (
        <>
            <Navbar />
            <div style={{ marginTop: '100px', marginBottom: '175px' }}>
                {location.pathname === '/' && <HeroSection />}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/rentals" element={<RentalsPage />} />
                    <Route path="/cars" element={<CarSearchResultsPage />} />
                    <Route path="/cars/:id" element={<CarDetailPage />} />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <AdminRoute>
                                <DashboardPage />
                            </AdminRoute>
                        }
                    />
                    <Route path="/payment/status" element={<PaymentStatusPage />} />
                    <Route path="/payment/:rentalId" element={<PaymentPage />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

// Root App Component
const App = () => {
    return (
        <Router>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <UserProvider>
                    <AppContent />
                </UserProvider>
            </LocalizationProvider>
        </Router>
    );
};

export default App;
