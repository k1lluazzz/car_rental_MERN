import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Slider,
  Container,
  Divider,
  IconButton,
  Collapse,
  Button,
  Chip,
  CircularProgress,
  Fab,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CarList from "../components/CarList";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const RentalsPage = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    brand: "",
    transmission: "",
    seats: "",
    fuelType: "",
  });
  const [tempFilters, setTempFilters] = useState({
    priceRange: [0, 5000],
    brand: "",
    transmission: "",
    seats: "",
    fuelType: "",
  });
  const [showFilters, setShowFilters] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [debouncedRange, setDebouncedRange] = useState(filters.priceRange);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const handleFilterChange = (field, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setIsFiltering(true);
    setFilters(tempFilters);

    // Count active filters
    const active = Object.entries(tempFilters).reduce((count, [key, value]) => {
      if (key === "priceRange") {
        return count + (value[0] > 0 || value[1] < 5000 ? 1 : 0);
      }
      return count + (value ? 1 : 0);
    }, 0);

    setActiveFilters(active);
    setTimeout(() => setIsFiltering(false), 500);
  };
  const handleResetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 5000],
      brand: "",
      transmission: "",
      seats: "",
      fuelType: "",
    };
    setTempFilters(defaultFilters);
    setIsFiltering(true);
    setFilters(defaultFilters);
    setActiveFilters(0);
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Debounced price range handler
  const debouncedHandlePriceChange = useCallback(
    (newValue) => {
      setDebouncedRange(newValue);
      const timeoutId = setTimeout(() => {
        handleFilterChange("priceRange", newValue);
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [handleFilterChange]
  );

  // Handle immediate price range UI updates
  const handlePriceRangeChange = (event, newValue) => {
    setDebouncedRange(newValue);
    debouncedHandlePriceChange(newValue);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
          borderRadius: 2,
          color: "white",
          mb: 4,
        }}
      >
        <DriveEtaIcon sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Thuê xe tự lái
        </Typography>
        <Typography variant="subtitle1">
          Đa dạng lựa chọn xe với giá cả cạnh tranh
        </Typography>
      </Box>
      {/* Filter Section */}{" "}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FilterListIcon /> Bộ lọc tìm kiếm
            </Typography>
            {activeFilters > 0 && (
              <Chip
                label={`${activeFilters} bộ lọc đang áp dụng`}
                color="primary"
                size="small"
              />
            )}
          </Box>
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            color={activeFilters > 0 ? "primary" : "default"}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        <Collapse in={showFilters}>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography gutterBottom>Giá thuê (K/ngày)</Typography>
              <Slider
                value={debouncedRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={100}
                marks={[
                  { value: 0, label: "0K" },
                  { value: 1000, label: "1000K" },
                  { value: 3000, label: "3000K" },
                  { value: 5000, label: "5000K" },
                ]}
                sx={{
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#1976d2",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "#1976d2",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Thương hiệu"
                fullWidth
                value={tempFilters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Toyota">Toyota</MenuItem>
                <MenuItem value="Honda">Honda</MenuItem>
                <MenuItem value="Ford">Ford</MenuItem>
                <MenuItem value="Hyundai">Hyundai</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Số ghế"
                fullWidth
                value={tempFilters.seats}
                onChange={(e) => handleFilterChange("seats", e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="4">4 chỗ</MenuItem>
                <MenuItem value="5">5 chỗ</MenuItem>
                <MenuItem value="7">7 chỗ</MenuItem>
                <MenuItem value="16">16 chỗ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Hộp số"
                fullWidth
                value={tempFilters.transmission}
                onChange={(e) =>
                  handleFilterChange("transmission", e.target.value)
                }
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Số tự động">Số tự động</MenuItem>
                <MenuItem value="Số sàn">Số sàn</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Nhiên liệu"
                fullWidth
                value={tempFilters.fuelType}
                onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                variant="outlined"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Xăng">Xăng</MenuItem>
                <MenuItem value="Dầu">Dầu</MenuItem>
                <MenuItem value="Điện">Điện</MenuItem>
              </TextField>
            </Grid>{" "}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {isFiltering && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Đang lọc...
                    </Typography>
                  </Box>
                )}{" "}
                <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
                  <Button
                    variant="outlined"
                    onClick={handleResetFilters}
                    disabled={activeFilters === 0}
                  >
                    Đặt lại
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    disabled={
                      JSON.stringify(tempFilters) === JSON.stringify(filters)
                    }
                  >
                    Áp dụng
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
      {/* Car List Section */}
      <Box sx={{ mb: 4 }}>
        <CarList filters={filters} />
      </Box>
      {/* Scroll to Top Button */}
      <Fab
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: showScrollTop ? "flex" : "none",
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Container>
  );
};

export default RentalsPage;
