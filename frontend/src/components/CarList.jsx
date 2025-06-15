import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardMedia,
  Pagination,
  Skeleton,
  Paper,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ChairIcon from "@mui/icons-material/Chair";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CarList = ({ filters }) => {
  const [cars, setCars] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortedCarList, setSortedCarList] = useState([]);
  const carsPerPage = 9;
  const navigate = useNavigate();

  // Function to sort cars
  const sortCars = (carsToSort, rentals) => {
    return [...carsToSort].sort((a, b) => {
      const aRented = rentals.some((rental) => rental.car?._id === a._id);
      const bRented = rentals.some((rental) => rental.car?._id === b._id);

      // First priority: previously rented cars
      if (aRented !== bRented) {
        return aRented ? -1 : 1;
      }

      // Second priority: rating
      return (b.rating || 0) - (a.rating || 0);
    });
  };

  // Effect to sort cars whenever cars or userRentals change
  useEffect(() => {
    const sorted = sortCars(cars, userRentals);
    setSortedCarList(sorted);
  }, [cars, userRentals]);

  useEffect(() => {
    let isMounted = true;
    const fetchUserRentals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/rentals/my-rentals",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (isMounted) {
          setUserRentals(response.data);
        }
      } catch (error) {
        console.error("Error fetching user rentals:", error);
      }
    };

    const fetchCars = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        // Add filters to query params
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== "" && value !== undefined) {
              queryParams.append(key, value);
            }
          });
        }
        const response = await axios.get(
          `http://localhost:5000/api/cars?${queryParams.toString()}`
        );
        if (isMounted) {
          // First set cars which will trigger the sorting effect
          setCars(response.data);
          // Then update loading state
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchUserRentals();
    fetchCars();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCarClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="60%" />
          </Paper>
        </Grid>
      ))}
    </Grid>
  ); // Calculate the cars to display on the current page
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = sortedCarList.slice(indexOfFirstCar, indexOfLastCar);

  if (!loading && sortedCarList.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Không tìm thấy xe phù hợp</Typography>
      </Box>
    );
  }

  const isCarPreviouslyBooked = (carId) => {
    return userRentals.some((rental) => rental.car?._id === carId);
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {currentCars.map((car) => (
          <Grid item key={car._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: isCarPreviouslyBooked(car._id)
                    ? "2px solid #1976d2"
                    : "none",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  minHeight: "350px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleCarClick(car._id)}
              >
                {isCarPreviouslyBooked(car._id) && (
                  <Chip
                    label="Đã từng đặt"
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: 8,
                      zIndex: 1,
                      backgroundColor: "rgba(25, 118, 210, 0.9)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "relative",
                    height: "180px", // Fixed height for the image
                    overflow: "hidden",
                    flexShrink: 0, // Prevent shrinking of the image box
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100%"
                    image={car.image || "https://via.placeholder.com/180"} // Fallback to placeholder image
                    alt={car.name}
                    sx={{
                      borderRadius: "10px 10px 0 0",
                      objectFit: "fit", // Ensure the full image is displayed
                      width: "100%", // Ensure the image fills the width
                      backgroundColor: "#f5f5f5", // Add a background color for better appearance
                    }}
                  />
                  {car.discount > 0 && (
                    <Chip
                      label={`Giảm ${car.discount}%`}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>
                <CardContent
                  sx={{
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px", // Add padding for better spacing
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginBottom: "5px" }}
                    >
                      {car.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "text.secondary",
                        marginBottom: "10px",
                      }}
                    >
                      <DirectionsCarIcon fontSize="small" />
                      <Typography variant="body2">
                        {car.transmission}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "text.secondary",
                        marginBottom: "10px",
                      }}
                    >
                      <LocalGasStationIcon fontSize="small" />
                      <Typography variant="body2">{car.fuelType}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "text.secondary",
                        marginBottom: "10px",
                      }}
                    >
                      <ChairIcon fontSize="small" />
                      <Typography variant="body2" noWrap>
                        {car.seats} chỗ
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "text.secondary",
                        marginBottom: "10px",
                      }}
                    >
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2" noWrap>
                        {car.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {" "}
                        <StarIcon
                          sx={{ color: "#FFD700", fontSize: "small" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", ml: 0.5 }}
                        >
                          {typeof car.rating === "number"
                            ? `${car.rating.toFixed(1)}/5`
                            : "0.0/5"}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        {car.trips || 0} chuyến
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {car.pricePerDay.toLocaleString()}K/ngày
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {" "}
        <Pagination
          count={Math.ceil(sortedCarList.length / carsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CarList;
