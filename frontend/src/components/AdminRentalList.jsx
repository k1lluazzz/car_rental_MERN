import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Alert,
  Box,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const AdminRentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRental, setSelectedRental] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

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
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      let errorMessage = "Không thể tải danh sách đơn thuê";
      if (error.response?.data?.message) {
        errorMessage += `: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (rental) => {
    setSelectedRental(rental);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRental(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Chờ thanh toán" },
      deposit_paid: { color: "info", label: "Đã đặt cọc" },
      completed: { color: "success", label: "Đã thanh toán" },
      returned: { color: "success", label: "Đã trả xe" },
      cancelled: { color: "error", label: "Đã hủy" },
    };
    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip size="small" color={config.color} label={config.label} />;
  };
  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          gutterBottom
        >
          Đang tải danh sách đơn thuê...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchRentals}>
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Xe</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Thời gian thuê</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rental) => (
                <TableRow key={rental._id} hover>
                  <TableCell>{rental._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    {rental.car?.name} ({rental.car?.brand})
                  </TableCell>{" "}
                  <TableCell>
                    {rental.userId?.name || rental.userName}
                    <br />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {moment(rental.startDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                    <Typography variant="body2">
                      {moment(rental.endDate).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ({rental.durationInDays} ngày)
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(rental.status)}</TableCell>
                  <TableCell>
                    <Typography>
                      {rental.totalAmount?.toLocaleString()}đ
                    </Typography>
                    {rental.status === "deposit_paid" && (
                      <Typography variant="caption" color="error">
                        Còn lại: {(rental.totalAmount * 0.7).toLocaleString()}đ
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(rental)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rentals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} của ${count}`
        }
      />

      {/* Dialog hiển thị chi tiết đơn thuê */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Chi tiết đơn thuê #{selectedRental?._id.slice(-6).toUpperCase()}
        </DialogTitle>
        <DialogContent>
          {selectedRental && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Thông tin xe
                </Typography>
                <Typography>
                  {selectedRental.car?.name} ({selectedRental.car?.brand})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Biển số: {selectedRental.car?.licensePlate || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Thông tin khách hàng
                </Typography>
                <Typography>{selectedRental.userId?.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {selectedRental.userId?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  SĐT: {selectedRental.userId?.phone || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Thời gian thuê
                </Typography>
                <Typography variant="body2">
                  Bắt đầu:{" "}
                  {moment(selectedRental.startDate).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Typography variant="body2">
                  Kết thúc:{" "}
                  {moment(selectedRental.endDate).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Typography variant="body2">
                  Thời gian: {selectedRental.durationInDays} ngày
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Thông tin thanh toán
                </Typography>
                <Typography variant="body2">
                  Tổng tiền: {selectedRental.totalAmount?.toLocaleString()}đ
                </Typography>
                {selectedRental.status === "deposit_paid" && (
                  <>
                    <Typography variant="body2">
                      Đã đặt cọc:{" "}
                      {(selectedRental.totalAmount * 0.3).toLocaleString()}đ
                    </Typography>
                    <Typography variant="body2" color="error">
                      Còn lại:{" "}
                      {(selectedRental.totalAmount * 0.7).toLocaleString()}đ
                    </Typography>
                  </>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Trạng thái
                </Typography>
                {getStatusChip(selectedRental.status)}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminRentalList;
