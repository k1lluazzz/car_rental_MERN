import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import Toast from "../components/Toast";

const PaymentPage = () => {
  const { rentalId } = useParams();
  const location = useLocation();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [paymentType, setPaymentType] = useState("full");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const navigate = useNavigate();

  const isRemainingPayment =
    new URLSearchParams(location.search).get("source") === "remaining";

  const calculateTotalPrice = () => {
    if (!rental) return 0;
    const days = Math.ceil(
      (new Date(rental.endDate) - new Date(rental.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    const basePrice = days * rental.car.pricePerDay;
    return rental.car.discount > 0
      ? basePrice * (1 - rental.car.discount / 100)
      : basePrice;
  };

  const calculateDepositAmount = () => {
    const totalPrice = calculateTotalPrice();
    return Math.ceil(totalPrice * 0.3);
  };

  const calculateRemainingAmount = () => {
    const totalPrice = calculateTotalPrice();
    const depositAmount = calculateDepositAmount();
    return totalPrice - depositAmount;
  };

  const getPaymentAmount = () => {
    if (paymentType === "remaining" && rental.status === "deposit_paid") {
      return Math.ceil(rental.totalPrice * 0.7); // Return remaining 70%
    }
    return paymentType === "full"
      ? calculateTotalPrice()
      : calculateDepositAmount();
  };

  const originalPrice = () => {
    const days = Math.ceil(
      (new Date(rental.endDate) - new Date(rental.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    return days * rental.car.pricePerDay;
  };

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/rentals/${rentalId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRental(response.data);

        // Set payment type based on URL parameter
        const params = new URLSearchParams(window.location.search);
        if (params.get("paymentType") === "remaining") {
          setPaymentType("remaining");
        }
      } catch (error) {
        setToast({
          open: true,
          message:
            error.response?.data?.message || "Error loading rental details",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (rentalId) {
      fetchRental();
    }
  }, [rentalId]);

  const checkCarAvailability = async () => {
    try {
      setChecking(true);
      const response = await axios.get(
        `http://localhost:5000/api/cars/${rental.car._id}/availability`,
        {
          params: {
            startDate: rental.startDate,
            endDate: rental.endDate,
          },
        }
      );
      return response.data.available;
    } catch (error) {
      console.error("Error checking car availability:", error);
      return false;
    } finally {
      setChecking(false);
    }
  };
  const handlePayment = async (method) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isCarChange = params.get("source") === "carchange";
      const isRemainingPayment = rental.status === "deposit_paid";

      // Skip availability check if it's a remaining payment or car change
      const shouldCheckAvailability =
        !isCarChange && !isRemainingPayment && rental.status !== "unpaid";

      if (shouldCheckAvailability) {
        const isAvailable = await checkCarAvailability();
        if (!isAvailable) {
          setToast({
            open: true,
            message:
              "Xe đã được đặt trong thời gian này. Vui lòng chọn xe khác.",
            severity: "error",
          });
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/payments/create_payment_url",
        {
          rentalId,
          amount: getPaymentAmount(),
          paymentType: paymentType,
        }
      );
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Payment creation failed",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isRemainingPayment
          ? "Thanh toán số tiền còn lại"
          : "Thanh toán đơn thuê xe"}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chi tiết đơn hàng
        </Typography>
        <Grid container spacing={2}>
          {rental && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <DirectionsCarIcon sx={{ mr: 1 }} />
                  <Typography>
                    Xe: {rental.car.name} ({rental.car.brand})
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography>
                    Thời gian thuê: {rental.durationInDays} ngày
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography>
                    Từ: {new Date(rental.startDate).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography>
                    Đến: {new Date(rental.endDate).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {rental.status === "deposit_paid" ? (
                  <Typography variant="h6" color="primary">
                    Số tiền cần thanh toán:{" "}
                    {Math.ceil(rental.totalPrice * 0.7).toLocaleString()} VNĐ
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h6" color="primary">
                      Tổng tiền: {calculateTotalPrice().toLocaleString()} VNĐ
                    </Typography>
                    {rental.car.discount > 0 && (
                      <>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {originalPrice().toLocaleString()} VNĐ
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          (Giảm {rental.car.discount}%)
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {rental && rental.status !== "deposit_paid" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Chọn hình thức thanh toán
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant={paymentType === "full" ? "contained" : "outlined"}
                onClick={() => setPaymentType("full")}
                sx={{ mb: 1, justifyContent: "space-between", px: 3 }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Thanh toán toàn bộ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calculateTotalPrice().toLocaleString()} VNĐ
                  </Typography>
                </Box>
                <PaymentIcon />
              </Button>

              <Button
                fullWidth
                variant={paymentType === "deposit" ? "contained" : "outlined"}
                onClick={() => setPaymentType("deposit")}
                sx={{ justifyContent: "space-between", px: 3 }}
              >
                <Box>
                  <Typography variant="subtitle1">Đặt cọc 30%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calculateDepositAmount().toLocaleString()} VNĐ
                  </Typography>
                </Box>
                <PaymentIcon />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Chọn cổng thanh toán
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePayment("vnpay")}
              startIcon={<PaymentIcon />}
              disabled={checking}
            >
              {checking ? "Đang kiểm tra..." : "VNPay"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Toast
        open={toast.open}
        handleClose={() => setToast({ ...toast, open: false })}
        severity={toast.severity}
        message={toast.message}
      />
    </Box>
  );
};

export default PaymentPage;
