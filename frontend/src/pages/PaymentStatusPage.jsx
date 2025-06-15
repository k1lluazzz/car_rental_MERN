import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Check, Close, ReportProblem } from "@mui/icons-material";
import axios from "axios";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const hasError = searchParams.get("error") === "1";
  const errorParam = searchParams.get("message");
  const paymentType = searchParams.get("type");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        if (hasError) {
          setError(true);
          setErrorMessage(getErrorMessage(errorParam));
          setLoading(false);
          return;
        }

        if (!orderId) {
          setError(true);
          setErrorMessage("Không tìm thấy mã đơn hàng");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/payments/status/${orderId}`
        );
        if (!response.data) {
          throw new Error("Không tìm thấy thông tin thanh toán");
        }
        console.log("Payment status response:", response.data);
        setPayment(response.data);
      } catch (error) {
        console.error("Error checking payment status:", error);
        setError(true);
        setErrorMessage(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    const getErrorMessage = (code) => {
      switch (code) {
        case "payment_failed":
          return "Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.";
        case "rental_not_found":
          return "Không tìm thấy thông tin đơn hàng. Vui lòng liên hệ với chúng tôi để được hỗ trợ.";
        case "Invalid signature":
          return "Chữ ký xác thực không hợp lệ. Vui lòng thử lại giao dịch.";
        default:
          return errorParam
            ? decodeURIComponent(errorParam)
            : "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.";
      }
    };

    checkPaymentStatus();
  }, [orderId, hasError, errorParam]);

  const handleViewRentals = () => {
    navigate("/my-rentals");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <ReportProblem sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error">
            Thanh toán thất bại
          </Typography>
          <Typography color="text.secondary" paragraph>
            {errorMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={handleViewRentals}
            sx={{ mt: 2 }}
          >
            Xem đơn thuê xe
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Check sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
        <Typography variant="h5" gutterBottom color="success.main">
          Thanh toán thành công
        </Typography>

        {paymentType === "remaining" ? (
          <Typography paragraph>
            Bạn đã thanh toán thành công số tiền còn lại. Cảm ơn bạn đã sử dụng
            dịch vụ của chúng tôi.
          </Typography>
        ) : paymentType === "deposit" ? (
          <>
            <Typography paragraph>
              Bạn đã đặt cọc thành công. Vui lòng thanh toán số tiền còn lại sau
              khi thuê xe xong.
            </Typography>
            <Typography color="warning.main" paragraph>
              Lưu ý: Đơn thuê xe sẽ không được hoàn tất cho đến khi bạn thanh
              toán đầy đủ.
            </Typography>
          </>
        ) : (
          <Typography paragraph>
            Bạn đã thanh toán toàn bộ số tiền thành công. Cảm ơn bạn đã sử dụng
            dịch vụ của chúng tôi.
          </Typography>
        )}

        <Button variant="contained" onClick={handleViewRentals} sx={{ mt: 2 }}>
          Xem đơn thuê xe
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentStatusPage;
