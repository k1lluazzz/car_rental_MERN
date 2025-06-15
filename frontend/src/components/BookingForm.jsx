import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Grid,
  IconButton,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
  LocationOn as LocationOnIcon,
  CalendarMonth as CalendarMonthIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon,
  LocalOffer as LocalOfferIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import axios from "axios";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const BookingForm = ({ carId, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [defaultTime, setDefaultTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(),
    duration: "",
  });
  const [rentalType, setRentalType] = useState("day");
  const [isCustomTimeSelected, setIsCustomTimeSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/cars/${carId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCar(response.data);
        setSelectedLocation(response.data.location);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car:", error);
        setLoading(false);
        if (error.response && error.response.status === 401) {
          setToast({
            open: true,
            severity: "error",
            message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
          });
        } else {
          setToast({
            open: true,
            severity: "error",
            message: "Không thể tải thông tin xe",
          });
        }
      }
    };
    fetchCar();
  }, [carId]);

  const originalPrice = useCallback(() => {
    if (!car || !selectedOptions.startDate) return 0;

    let duration;
    if (rentalType === "day" && selectedOptions.endDate) {
      // Khi thuê theo ngày, tính số ngày giữa startDate và endDate
      const start = new Date(selectedOptions.startDate);
      const end = new Date(selectedOptions.endDate);
      if (selectedOptions.startTime) {
        start.setHours(
          selectedOptions.startTime.getHours(),
          selectedOptions.startTime.getMinutes()
        );
      }
      if (selectedOptions.endTime) {
        end.setHours(
          selectedOptions.endTime.getHours(),
          selectedOptions.endTime.getMinutes()
        );
      }
      duration = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      return duration * car.pricePerDay;
    } else if (rentalType === "hour" && selectedOptions.duration) {
      // Khi thuê theo giờ, tính giá theo số giờ
      const hours = Number(selectedOptions.duration);
      // Tính giá theo giờ (giá một ngày / 24 * số giờ thuê)
      return Math.ceil((car.pricePerDay / 24) * hours);
    }
    return 0;
  }, [selectedOptions, car, rentalType]);

  const calculatePrice = useCallback(() => {
    const basePrice = originalPrice();
    return car && car.discount > 0
      ? Math.floor(basePrice * (1 - car.discount / 100))
      : basePrice;
  }, [car, originalPrice]);

  useEffect(() => {
    if (car && selectedOptions.startDate && selectedOptions.endDate) {
      setCalculatedPrice(calculatePrice());
    }
  }, [car, selectedOptions.startDate, selectedOptions.endDate, calculatePrice]);

  const handleOptionChange = (field, value) => {
    setSelectedOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    const { startDate, startTime, endDate, endTime, duration } =
      selectedOptions;
    if (rentalType === "day" && startDate && startTime && endDate && endTime) {
      setDefaultTime(
        `${startTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}, ${startDate.toLocaleDateString(
          "en-GB"
        )} - ${endTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}, ${endDate.toLocaleDateString("en-GB")}`
      );
      setIsCustomTimeSelected(true);
    } else if (rentalType === "hour" && startDate && startTime && duration) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10));

      setDefaultTime(
        `${startDateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}, ${startDateTime.toLocaleDateString(
          "en-GB"
        )} - ${endDateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}, ${endDateTime.toLocaleDateString("en-GB")}`
      );
      setIsCustomTimeSelected(true);
    }
    setTimeModalOpen(false);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setToast({
        open: true,
        severity: "error",
        message: "Vui lòng đăng nhập để đặt xe",
      });
      return;
    }

    if (!isCustomTimeSelected && !defaultTime) {
      setToast({
        open: true,
        severity: "error",
        message: "Vui lòng chọn thời gian thuê xe",
      });
      return;
    }

    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      const userData = JSON.parse(user);
      if (!userData.name) {
        setToast({
          open: true,
          severity: "error",
          message: "Không tìm thấy thông tin người dùng",
        });
        return;
      } // Calculate duration in days
      const startDate = new Date(selectedOptions.startDate);
      const endDate = new Date(selectedOptions.endDate);
      startDate.setHours(
        selectedOptions.startTime.getHours(),
        selectedOptions.startTime.getMinutes()
      );
      endDate.setHours(
        selectedOptions.endTime.getHours(),
        selectedOptions.endTime.getMinutes()
      );

      const durationInDays = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const originalPriceValue = durationInDays * car.pricePerDay;
      const totalPriceValue = car.discount
        ? Math.floor(originalPriceValue * (1 - car.discount / 100))
        : originalPriceValue;

      const bookingData = {
        car: carId,
        userName: userData.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: selectedLocation,
        userId: userData._id,
        originalPrice: originalPriceValue,
        totalPrice: totalPriceValue,
        totalAmount: totalPriceValue,
        durationInDays,
        discount: car.discount || 0,
      };

      const response = await axios.post(
        "http://localhost:5000/api/rentals/book",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast({
        open: true,
        severity: "success",
        message: "Đặt xe thành công!",
      });

      setTimeout(() => {
        navigate(`/payment/${response.data._id}`);
      }, 1500);
    } catch (error) {
      console.error("Booking error:", error);
      setToast({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "Đặt xe thất bại",
      });

      if (error.response && error.response.status === 401) {
        setToast({
          open: true,
          severity: "error",
          message: "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        {/* Địa điểm và Thông tin thời gian */}
        <Stack spacing={3}>
          {/* Địa điểm */}
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <LocationOnIcon color="primary" />
                <Typography variant="h6">Địa điểm</Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", ml: 4 }}
              >
                {car?.location || "Đang tải..."}
              </Typography>
            </CardContent>
          </Card>

          {/* Thời gian thuê */}
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">Thời gian thuê</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  border: "1px dashed",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => setTimeModalOpen(true)}
              >
                {defaultTime ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon color="primary" />
                    <Typography>{defaultTime}</Typography>
                  </Box>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    Chọn thời gian thuê xe
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Chi phí thuê */}
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <LocalOfferIcon color="primary" />
                <Typography variant="h6">Chi phí thuê</Typography>
              </Box>

              {loading ? (
                <Typography variant="body1">Đang tải...</Typography>
              ) : !car ? (
                <Typography variant="body1" color="error">
                  Không tìm thấy thông tin xe
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {car.discount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {originalPrice()?.toLocaleString()}đ
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "white",
                          bgcolor: "error.light",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        Giảm {car.discount}%
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {calculatedPrice?.toLocaleString()}đ
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {car.pricePerDay.toLocaleString()}đ/ngày
                    </Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Nút đặt xe */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !isCustomTimeSelected}
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            Đặt xe ngay
          </Button>
        </Stack>

        {/* Time Selection Modal */}
        <Modal open={timeModalOpen} onClose={() => setTimeModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              minWidth: 300,
              maxWidth: 500,
              outline: "none",
              boxShadow: 24,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6">Chọn thời gian thuê</Typography>
              <IconButton onClick={() => setTimeModalOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <ToggleButtonGroup
              value={rentalType}
              exclusive
              onChange={(e, newType) => newType && setRentalType(newType)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="day"
                sx={{
                  py: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                Thuê theo ngày
              </ToggleButton>
              <ToggleButton
                value="hour"
                sx={{
                  py: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                Thuê theo giờ
              </ToggleButton>
            </ToggleButtonGroup>

            <Stack spacing={3}>
              {rentalType === "day" ? (
                <>
                  <DatePicker
                    label="Ngày nhận xe"
                    value={selectedOptions.startDate}
                    onChange={(newValue) =>
                      handleOptionChange("startDate", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                    minDate={new Date()}
                  />
                  <TimePicker
                    label="Thời gian nhận xe"
                    value={selectedOptions.startTime}
                    onChange={(newValue) =>
                      handleOptionChange("startTime", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                  <DatePicker
                    label="Ngày trả xe"
                    value={selectedOptions.endDate}
                    onChange={(newValue) =>
                      handleOptionChange("endDate", newValue)
                    }
                    minDate={selectedOptions.startDate || new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                  <TimePicker
                    label="Thời gian trả xe"
                    value={selectedOptions.endTime}
                    onChange={(newValue) =>
                      handleOptionChange("endTime", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <DatePicker
                    label="Ngày thuê"
                    value={selectedOptions.startDate}
                    onChange={(newValue) =>
                      handleOptionChange("startDate", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                    minDate={new Date()}
                  />
                  <TimePicker
                    label="Thời gian bắt đầu"
                    value={selectedOptions.startTime}
                    onChange={(newValue) =>
                      handleOptionChange("startTime", newValue)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                      },
                    }}
                  />
                  <TextField
                    label="Số giờ thuê"
                    type="number"
                    fullWidth
                    value={selectedOptions.duration}
                    onChange={(e) =>
                      handleOptionChange("duration", e.target.value)
                    }
                    variant="outlined"
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                  />
                </>
              )}

              <Button
                variant="contained"
                onClick={handleContinue}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Xác nhận
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </LocalizationProvider>
  );
};

export default BookingForm;
