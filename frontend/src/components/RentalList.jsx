import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleAuthError = useCallback(
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
    [navigate]
  );

  const fetchRentals = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/rentals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      handleAuthError(error);
      setError("Không thể tải danh sách đơn thuê");
    } finally {
      setLoading(false);
    }
  }, [navigate, handleAuthError]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsAdmin(user?.role === "admin");
  }, []);

  const handleUpdateStatus = async (rentalId, newStatus) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/rentals/${rentalId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRentals();
    } catch (error) {
      console.error("Error updating rental status:", error);
      handleAuthError(error);
      setError("Không thể cập nhật trạng thái đơn thuê");
    }
  };

  const handlePayRemainingBalance = (rental) => {
    navigate(`/payment/${rental._id}?paymentType=remaining`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRental(null);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = rentals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(rentals.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "deposit_paid":
        return "warning";
      case "returned":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã thanh toán";
      case "pending":
        return "Đang chờ";
      case "cancelled":
        return "Đã hủy";
      case "deposit_paid":
        return "Đã đặt cọc";
      case "returned":
        return "Đã trả xe";
      default:
        return status;
    }
  };

  const getCarDisplayName = (rental) => {
    if (!rental?.car) return "Xe không xác định";
    return `${rental.car.name || "N/A"} ${
      rental.car.brand ? `(${rental.car.brand})` : ""
    }`;
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {rentals.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center">Không có đơn thuê nào</Typography>
          </Grid>
        ) : (
          <>
            {paginatedRentals.map((rental) => (
              <Grid item xs={12} md={6} key={rental._id}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6" component="h2">
                        {getCarDisplayName(rental)}
                      </Typography>
                      <Chip
                        label={getStatusText(rental.status)}
                        color={getStatusColor(rental.status)}
                      />
                    </Box>

                    <Typography color="text.secondary" gutterBottom>
                      Ngày bắt đầu:{" "}
                      {moment(rental.startDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Ngày kết thúc:{" "}
                      {moment(rental.endDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Thời gian thuê: {rental.durationInDays} ngày
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Giá gốc: {rental.originalPrice?.toLocaleString() || 0} VNĐ
                    </Typography>
                    <Typography variant="body1" color="primary" gutterBottom>
                      Tổng tiền: {rental.totalPrice?.toLocaleString() || 0} VNĐ
                    </Typography>

                    {rental.status === "deposit_paid" && (
                      <Box mt={2}>
                        <Typography
                          variant="body2"
                          color="warning.main"
                          gutterBottom
                        >
                          Số tiền còn lại cần thanh toán:{" "}
                          {((rental.totalPrice || 0) * 0.7).toLocaleString()}{" "}
                          VNĐ
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePayRemainingBalance(rental)}
                          fullWidth
                        >
                          Thanh toán số tiền còn lại
                        </Button>
                      </Box>
                    )}

                    {rental.status === "completed" &&
                      !rental.review &&
                      !isAdmin &&
                      rental.car && (
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => {
                              setSelectedRental(rental);
                              setOpen(true);
                            }}
                          >
                            Đánh giá
                          </Button>
                        </Box>
                      )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>

      {rentals.length > 0 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Số mục/trang</InputLabel>
            <Select
              value={itemsPerPage}
              label="Số mục/trang"
              onChange={handleItemsPerPageChange}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedRental?.car
            ? `Đánh giá xe ${selectedRental.car.name || "N/A"}`
            : "Đánh giá xe"}
        </DialogTitle>
        <DialogContent>{/* Add review form content here */}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleClose} color="primary">
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RentalList;
