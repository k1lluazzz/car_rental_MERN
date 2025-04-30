import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { PeopleAlt, DirectionsCar, Receipt, AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import UserTable from '../components/UserTable';
import CarList from '../components/CarList';
import RentalList from '../components/RentalList';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        totalRentals: 0,
        totalRevenue: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsResponse, revenueResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', { headers }),
                    axios.get('http://localhost:5000/api/admin/revenue', { headers })
                ]);

                setStats(statsResponse.data);
                setRevenueData(revenueResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Tổng số người dùng"
                        value={stats.totalUsers}
                        icon={<PeopleAlt />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Tổng số xe"
                        value={stats.totalCars}
                        icon={<DirectionsCar />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Tổng số đơn thuê"
                        value={stats.totalRentals}
                        icon={<Receipt />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Tổng doanh thu"
                        value={`${stats.totalRevenue.toLocaleString()}đ`}
                        icon={<AttachMoney />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            {/* Revenue Chart */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Doanh thu theo tháng
                </Typography>
                <RevenueChart data={revenueData} />
            </Paper>

            {/* User Management */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quản lý người dùng
                </Typography>
                <UserTable />
            </Paper>

            {/* Car Management */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quản lý xe
                </Typography>
                <CarList />
            </Paper>

            {/* Rental Management */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quản lý đơn thuê
                </Typography>
                <RentalList />
            </Paper>
        </Box>
    );
};

export default DashboardPage;
