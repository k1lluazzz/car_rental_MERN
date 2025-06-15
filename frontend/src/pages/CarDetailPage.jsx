import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Card,
  CardMedia,
  Skeleton,
  Rating,
  Divider,
  Stack,
} from "@mui/material";
import {
  DirectionsCar,
  LocalGasStation,
  Person,
  Speed,
  ArrowBack,
  LocationOn,
  Star,
  DriveEta,
} from "@mui/icons-material";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import RentalSchedule from "../components/RentalSchedule";
import CarReviews from "../components/CarReviews";

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarCars, setSimilarCars] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cars/${id}`
        );
        setCar(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    const fetchSimilarCars = async () => {
      if (car) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/cars/similar/${car._id}?brand=${car.brand}`
          );
          setSimilarCars(response.data);
        } catch (error) {
          console.error("Error fetching similar cars:", error);
        }
      }
    };

    fetchSimilarCars();
  }, [car]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={30} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Không tìm thấy thông tin xe
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  const features = [
    { icon: <DirectionsCar />, label: car.transmission },
    { icon: <LocalGasStation />, label: car.fuelType },
    { icon: <Person />, label: `${car.seats} chỗ` },
    { icon: <Speed />, label: "Số tự động" },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Grid container spacing={4}>
        {/* Car Image Section */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              image={car.image}
              alt={car.name}
              sx={{ objectFit: "contain" }}
            />
          </Card>
        </Grid>

        {/* Car Details Section */}
        <Grid item xs={12} md={5}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {car.name}
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {car.pricePerDay?.toLocaleString()}đ/ngày
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "background.default",
                      }}
                    >
                      {feature.icon}
                      <Typography variant="body2">{feature.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Địa điểm
              </Typography>
              <Chip
                icon={<LocationOn />}
                label={car.location}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>{" "}
            {/* Hiển thị đánh giá và số chuyến */}
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Star color="warning" />
                      <Typography variant="h6">
                        {car.rating?.toFixed(1) || "0"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({car.totalRatings || 0} đánh giá)
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "background.default",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <DriveEta />
                      <Typography variant="h6">{car.trips || 0}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        chuyến
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            {car.discount > 0 && (
              <Box sx={{ mt: 3 }}>
                <Chip
                  label={`Giảm ${car.discount}%`}
                  color="error"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            )}
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ flex: 1 }}
                onClick={() => setShowBookingForm(true)}
              >
                Đặt xe ngay
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowSchedule(true)}
              >
                Xem lịch thuê
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Booking Form */}
      {showBookingForm && (
        <Paper sx={{ mt: 4, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin đặt xe
          </Typography>
          <BookingForm
            carId={id}
            onBookingSuccess={() => navigate("/my-rentals")}
          />
        </Paper>
      )}

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Đánh giá từ khách hàng
        </Typography>
        <CarReviews reviews={car.reviews} loading={loading} />
      </Box>

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Xe tương tự
          </Typography>
          <Grid container spacing={3}>
            {similarCars.slice(0, 3).map((similarCar) => (
              <Grid item xs={12} sm={6} md={4} key={similarCar._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/cars/${similarCar._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={similarCar.image}
                    alt={similarCar.name}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">{similarCar.name}</Typography>
                    <Typography color="primary" variant="subtitle1">
                      {similarCar.pricePerDay?.toLocaleString()}đ/ngày
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <RentalSchedule
        carId={id}
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
      />
    </Container>
  );
};

export default CarDetailPage;
