import React, { useState, useEffect } from 'react';
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
    Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import Toast from './Toast';

const AdminCarManagement = () => {
    const [cars, setCars] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        pricePerDay: '',
        transmission: '',
        seats: '',
        fuelType: '',
        location: '',
        image: null
    });
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const fetchCars = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/cars', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setToast({
                open: true,
                message: 'Không thể tải danh sách xe',
                severity: 'error'
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
                image: null
            });
        } else {
            setSelectedCar(null);
            setFormData({
                name: '',
                brand: '',
                pricePerDay: '',
                transmission: '',
                seats: '',
                fuelType: '',
                location: '',
                image: null
            });
        }
        setOpenDialog(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        // Add all required fields to FormData
        Object.keys(formData).forEach(key => {
            // Handle special case for seats - convert to number
            if (key === 'seats' && formData[key]) {
                data.append(key, Number(formData[key]));
            }
            // Handle special case for pricePerDay - convert to number
            else if (key === 'pricePerDay' && formData[key]) {
                data.append(key, Number(formData[key]));
            }
            // Handle all other fields
            else if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        // Validate required fields
        const requiredFields = ['name', 'brand', 'pricePerDay', 'transmission', 'seats', 'fuelType', 'location'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setToast({
                open: true,
                message: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`,
                severity: 'error'
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            if (selectedCar) {
                // Update existing car
                await axios.put(`http://localhost:5000/api/cars/${selectedCar._id}`, data, { headers });
                setToast({
                    open: true,
                    message: 'Cập nhật xe thành công',
                    severity: 'success'
                });
            } else {
                // Add new car
                await axios.post('http://localhost:5000/api/cars', data, { headers });
                setToast({
                    open: true,
                    message: 'Thêm xe mới thành công',
                    severity: 'success'
                });
            }
            setOpenDialog(false);
            fetchCars();
        } catch (error) {
            console.error('Error:', error);
            setToast({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra',
                severity: 'error'
            });
        }
    };

    const handleDelete = async (carId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setToast({
                    open: true,
                    message: 'Xóa xe thành công',
                    severity: 'success'
                });
                fetchCars();
            } catch (error) {
                console.error('Error deleting car:', error);
                setToast({
                    open: true,
                    message: 'Không thể xóa xe',
                    severity: 'error'
                });
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cars.map((car) => (
                            <TableRow key={car._id}>
                                <TableCell>{car.name}</TableCell>
                                <TableCell>{car.brand}</TableCell>
                                <TableCell>{car.pricePerDay.toLocaleString()}K</TableCell>
                                <TableCell>{car.transmission}</TableCell>
                                <TableCell>{car.seats}</TableCell>
                                <TableCell>{car.fuelType}</TableCell>
                                <TableCell>{car.location}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenDialog(car)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(car._id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedCar ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
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
                                <MenuItem value="Toyota">Toyota</MenuItem>
                                <MenuItem value="Honda">Honda</MenuItem>
                                <MenuItem value="Ford">Ford</MenuItem>
                                <MenuItem value="Hyundai">Hyundai</MenuItem>
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
                                <MenuItem value="Số tự động">Số tự động</MenuItem>
                                <MenuItem value="Số sàn">Số sàn</MenuItem>
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
                                <MenuItem value="4">4 chỗ</MenuItem>
                                <MenuItem value="5">5 chỗ</MenuItem>
                                <MenuItem value="7">7 chỗ</MenuItem>
                                <MenuItem value="16">16 chỗ</MenuItem>
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
                                <MenuItem value="Xăng">Xăng</MenuItem>
                                <MenuItem value="Dầu">Dầu</MenuItem>
                                <MenuItem value="Điện">Điện</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Vị trí"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ marginTop: '10px' }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedCar ? 'Cập nhật' : 'Thêm mới'}
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