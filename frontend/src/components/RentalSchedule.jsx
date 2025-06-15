import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  EventAvailable as EventAvailableIcon,
} from "@mui/icons-material";
import axios from "axios";
import moment from "moment";

const RentalSchedule = ({ carId, open, onClose }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalSchedule = async () => {
      if (!carId || !open) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/cars/${carId}/schedule`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sortedRentals = response.data.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setRentals(sortedRentals);
        setError(null);
      } catch (err) {
        console.error("Error fetching rental schedule:", err);
        setError("Không thể tải lịch thuê xe");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchRentalSchedule();
    }
  }, [carId, open]);

  const getStatusColor = (rental) => {
    const now = moment();
    const start = moment(rental.startDate);
    return start.isBefore(now) ? "error" : "primary";
  };
  const getRelativeTime = (date) => {
    const now = moment().startOf("day");
    const target = moment(date).startOf("day");
    const days = target.diff(now, "days");

    if (days === 0) return "Hôm nay";
    if (days === 1) return "Ngày mai";
    if (days === -1) return "Hôm qua";
    if (days > 0) return `${days} ngày nữa`;
    return `${Math.abs(days)} ngày trước`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (rentals.length === 0) {
      return (
        <Box
          sx={{
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <EventAvailableIcon sx={{ fontSize: 60, color: "success.main" }} />
          <Typography variant="h6" color="text.secondary">
            Chưa có lịch đặt trước
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xe này đang sẵn sàng để đặt
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {rentals.map((rental, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              "&:hover": {
                boxShadow: 2,
                transform: "translateY(-2px)",
                transition: "all 0.2s",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarMonthIcon color={getStatusColor(rental)} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {moment(rental.startDate).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moment(rental.startDate).format("HH:mm")}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={getRelativeTime(rental.startDate)}
                  color={getStatusColor(rental)}
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                  p: 1,
                  mb: 2,
                }}
              >
                <AccessTimeIcon color="action" />
                <Typography variant="body2">
                  {rental.durationInDays} ngày
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Thời gian trả xe
                  </Typography>
                  <Typography>
                    {moment(rental.endDate).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Box>
                <Chip
                  variant="outlined"
                  size="small"
                  label={getRelativeTime(rental.endDate)}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6">Lịch thuê xe</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2, mt: 1 }}>{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default RentalSchedule;
