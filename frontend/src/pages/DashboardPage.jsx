import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  PeopleAlt,
  DirectionsCar,
  Receipt,
  AttachMoney,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import StatsCard from "../components/StatsCard";
import RevenueChart from "../components/RevenueChart";
import UserTable from "../components/UserTable";
import AdminCarManagement from "../components/AdminCarManagement";
import AdminRentalList from "../components/AdminRentalList";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalRentals: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token || !user || user.role !== "admin") {
        navigate("/login");
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      if (!checkAuth()) return;

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsResponse, revenueResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", { headers }),
          axios.get("http://localhost:5000/api/admin/revenue", { headers }),
        ]);

        setStats(statsResponse.data);
        setRevenueData(revenueResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="xl">
      {/* Dashboard Header */}
      <Box
        sx={{
          py: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <DashboardIcon sx={{ fontSize: 40, color: "#1976d2" }} />
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Quản lý hệ thống
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Người dùng"
            value={stats.totalUsers}
            icon={<PeopleAlt />}
            color="#1976d2"
            trend="+5% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Xe cho thuê"
            value={stats.totalCars}
            icon={<DirectionsCar />}
            color="#2e7d32"
            trend="+3 xe mới trong tháng"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Đơn thuê"
            value={stats.totalRentals}
            icon={<Receipt />}
            color="#ed6c02"
            trend="+12% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Doanh thu"
            value={`${stats.totalRevenue.toLocaleString()}đ`}
            icon={<AttachMoney />}
            color="#9c27b0"
            trend="+8% so với tháng trước"
          />
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Biểu đồ doanh thu
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <RevenueChart data={revenueData} />
      </Paper>

      {/* Management Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              minWidth: 120,
            },
          }}
        >
          <Tab label="Quản lý xe" />
          <Tab label="Quản lý người dùng" />
          <Tab label="Quản lý đơn thuê" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {" "}
          {activeTab === 0 && <AdminCarManagement />}
          {activeTab === 1 && <UserTable />}
          {activeTab === 2 && <AdminRentalList />}
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
