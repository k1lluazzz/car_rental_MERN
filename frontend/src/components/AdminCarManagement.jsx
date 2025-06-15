import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Grid,
  Typography,
  Pagination,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import Toast from "./Toast";

// Danh sách hãng xe phổ biến
const CAR_BRANDS = [
  "Toyota",
  "Honda",
  "Ford",
  "Hyundai",
  "Mazda",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Lexus",
  "Lamborghini",
  "Kia",
  "Suzuki",
  "Porsche",
  "Volkswagen",
  "Mitsubishi",
  "Peugeot",
  "Chevrolet",
  "Nissan",
  "Subaru",
  "Land Rover",
  "Mini",
  "Volvo",
].sort();

const TRANSMISSION_TYPES = [
  { value: "automatic", label: "Tự động" },
  { value: "manual", label: "Số sàn" },
];

const FUEL_TYPES = [
  { value: "gasoline", label: "Xăng" },
  { value: "diesel", label: "Dầu diesel" },
  { value: "electric", label: "Điện" },
  { value: "hybrid", label: "Hybrid" },
];

const SEAT_OPTIONS = [4, 5, 7, 9, 16];

const AdminCarManagement = () => {
  const [cars, setCars] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    transmission: "",
    seats: "",
    fuelType: "",
    location: "",
    discount: "",
    image: null,
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setToast({
        open: true,
        message: "Không thể tải danh sách xe",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenDialog = (car = null) => {
    if (car) {
      setSelectedCar(car);
      setFormData({
        name: car.name,
        brand: car.brand,
        pricePerDay: car.pricePerDay,
        transmission: car.transmission,
        seats: car.seats,
        fuelType: car.fuelType,
        location: car.location,
        discount: car.discount || "",
        image: null,
      });
    } else {
      setSelectedCar(null);
      setFormData({
        name: "",
        brand: "",
        pricePerDay: "",
        transmission: "",
        seats: "",
        fuelType: "",
        location: "",
        image: null,
      });
    }
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Log form data for debugging
    console.log("Form data before submission:", {
      ...formData,
      image: formData.image ? formData.image.name : null,
    });

    // Add all required fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData[key]) {
        console.log("Adding image to form:", formData[key].name);
        data.append("image", formData[key]);
      }
      // Handle numeric fields
      else if (["seats", "pricePerDay"].includes(key) && formData[key]) {
        const numValue = Number(formData[key]);
        if (!isNaN(numValue)) {
          console.log(`Adding ${key}:`, numValue);
          data.append(key, numValue);
        }
      }
      // Handle all other fields
      else if (formData[key] !== null && formData[key] !== "") {
        console.log(`Adding ${key}:`, formData[key]);
        data.append(key, formData[key]);
      }
    });

    // Validate required fields
    const requiredFields = [
      "name",
      "brand",
      "pricePerDay",
      "transmission",
      "seats",
      "fuelType",
      "location",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setToast({
        open: true,
        message: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`,
        severity: "error",
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Log form data for debugging
      console.log("Submitting car data:", {
        name: formData.name,
        brand: formData.brand,
        pricePerDay: formData.pricePerDay,
        transmission: formData.transmission,
        seats: formData.seats,
        fuelType: formData.fuelType,
        location: formData.location,
        hasImage: !!formData.image,
      });

      if (selectedCar) {
        // Update existing car
        const response = await axios.put(
          `http://localhost:5000/api/cars/${selectedCar._id}`,
          data,
          { headers }
        );
        console.log("Update response:", response.data);
        setToast({
          open: true,
          message: "Cập nhật xe thành công",
          severity: "success",
        });
      } else {
        // Add new car
        const response = await axios.post(
          "http://localhost:5000/api/cars",
          data,
          { headers }
        );
        console.log("Create response:", response.data);
        setToast({
          open: true,
          message: "Thêm xe mới thành công",
          severity: "success",
        });
      }
      setOpenDialog(false);
      fetchCars();
    } catch (error) {
      console.error("Error:", error);
      setToast({
        open: true,
        message: error.response?.data?.message || "Có lỗi xảy ra",
        severity: "error",
      });
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa xe này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({
          open: true,
          message: "Xóa xe thành công",
          severity: "success",
        });
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
        setToast({
          open: true,
          message: "Không thể xóa xe",
          severity: "error",
        });
      }
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1);
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = cars.slice(startIndex, endIndex);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Quản lý xe</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Thêm xe mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên xe</TableCell>
              <TableCell>Hãng xe</TableCell>
              <TableCell>Giá/ngày</TableCell>
              <TableCell>Hộp số</TableCell>
              <TableCell>Số ghế</TableCell>
              <TableCell>Nhiên liệu</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Giảm giá</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCars.map((car) => (
              <TableRow key={car._id}>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.pricePerDay.toLocaleString()}K</TableCell>
                <TableCell>{car.transmission}</TableCell>
                <TableCell>{car.seats}</TableCell>
                <TableCell>{car.fuelType}</TableCell>
                <TableCell>{car.location}</TableCell>
                <TableCell>{car.discount ? `${car.discount}%` : "-"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(car)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(car._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {cars.length > 0 && (
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
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCar ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên xe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hãng xe"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                select
              >
                {" "}
                {CAR_BRANDS.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá thuê/ngày (K)"
                name="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hộp số"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                select
              >
                {" "}
                {TRANSMISSION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số ghế"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                select
              >
                {" "}
                {SEAT_OPTIONS.map((seats) => (
                  <MenuItem key={seats} value={seats}>
                    {seats} chỗ
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhiên liệu"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                select
              >
                {" "}
                {FUEL_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>{" "}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vị trí"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giảm giá (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginTop: "10px" }}
                  id="car-image-upload"
                />
                {(formData.image || selectedCar?.image) && (
                  <Box sx={{ mt: 2, maxWidth: "300px" }}>
                    <img
                      src={
                        formData.image
                          ? URL.createObjectURL(formData.image)
                          : selectedCar.image
                      }
                      alt="Car preview"
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedCar ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        handleClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
};

export default AdminCarManagement;
