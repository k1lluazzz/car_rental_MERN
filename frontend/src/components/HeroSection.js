import React, { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Modal, Grid, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [timeModalOpen, setTimeModalOpen] = useState(false);
    const [defaultTime, setDefaultTime] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        duration: '',
    });
    const [rentalType, setRentalType] = useState('day'); // 'day' or 'hour'
    const [selectedLocation, setSelectedLocation] = useState('Hà Nội');
    const navigate = useNavigate();

    const handleOptionChange = (field, value) => {
        setSelectedOptions((prev) => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        const { startDate, startTime, endDate, endTime, duration } = selectedOptions;
        if (rentalType === 'day' && startDate && startTime && endDate && endTime) {
            setDefaultTime(
                `${startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${startDate.toLocaleDateString('en-GB')} - ${endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${endDate.toLocaleDateString('en-GB')}`
            );
        } else if (rentalType === 'hour' && startDate && startTime && duration) {
            const startDateTime = new Date(startDate);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(endDateTime.getHours() + parseInt(duration, 10)); // Add duration in hours

            setDefaultTime(
                `${startDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${startDateTime.toLocaleDateString('en-GB')} - ${endDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${endDateTime.toLocaleDateString('en-GB')}`
            );
        }
        setTimeModalOpen(false);
    };

    const handleSearch = () => {
        if (selectedLocation) {
            navigate(`/cars?location=${encodeURIComponent(selectedLocation)}`); // Navigate with the location query parameter
        } else {
            alert('Vui lòng chọn khu vực.');
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    backgroundImage: 'url(./images/background_image.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    margin: '0 15%',
                    borderRadius: '20px',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: '80%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
                        HDOTO - Cùng Bạn Đến Mọi Hành Trình
                    </Typography>
                </Box>

                {/* Floating Box */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        width: '95%',
                        maxWidth: '900px',
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                marginBottom: '5px',
                                color: '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            <LocationOnIcon fontSize="small" />
                            Địa điểm
                        </Typography>
                        <TextField
                            select
                            variant="outlined"
                            fullWidth
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                            <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                            <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ flex: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                marginBottom: '5px',
                                color: '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}
                        >
                            <CalendarMonthIcon fontSize="small" />
                            Thời gian thuê
                        </Typography>
                        <TextField
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={defaultTime || `${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${today.toLocaleDateString('en-GB')} - ${tomorrow.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${tomorrow.toLocaleDateString('en-GB')}`}
                            onClick={() => setTimeModalOpen(true)}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ marginTop: '25px', padding: '10px 30px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        onClick={handleSearch}
                    >
                        Tìm Xe
                    </Button>
                </Box>
            </Box>

            {/* Time Modal */}
            <Modal open={timeModalOpen} onClose={() => setTimeModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '600px',
                        bgcolor: 'white',
                        borderRadius: '10px',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Thời gian</Typography>
                        <IconButton onClick={() => setTimeModalOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <ToggleButtonGroup
                        value={rentalType}
                        exclusive
                        onChange={(event, newType) => setRentalType(newType)}
                        sx={{ marginBottom: '10px' }}
                    >
                        <ToggleButton value="day">Thuê theo ngày</ToggleButton>
                        <ToggleButton value="hour">Thuê theo giờ</ToggleButton>
                    </ToggleButtonGroup>
                    {rentalType === 'day' && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày nhận xe"
                                    value={selectedOptions.startDate}
                                    onChange={(newValue) => handleOptionChange('startDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Thời gian nhận xe"
                                    value={selectedOptions.startTime}
                                    onChange={(newValue) => handleOptionChange('startTime', newValue)}
                                    ampm={false}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày trả xe"
                                    value={selectedOptions.endDate}
                                    onChange={(newValue) => handleOptionChange('endDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Thời gian trả xe"
                                    value={selectedOptions.endTime}
                                    onChange={(newValue) => handleOptionChange('endTime', newValue)}
                                    ampm={false}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                        </Grid>
                    )}
                    {rentalType === 'hour' && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Ngày bắt đầu"
                                    value={selectedOptions.startDate}
                                    onChange={(newValue) => handleOptionChange('startDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TimePicker
                                    label="Giờ nhận xe"
                                    value={selectedOptions.startTime}
                                    onChange={(newValue) => handleOptionChange('startTime', newValue)}
                                    ampm={false}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Thời gian thuê (giờ)"
                                    type="number"
                                    fullWidth
                                    value={selectedOptions.duration}
                                    onChange={(e) => {
                                        const value = Math.max(0, e.target.value); // Prevent negative values
                                        handleOptionChange('duration', value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '10px' }}
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </Button>
                </Box>
            </Modal>
        </LocalizationProvider>
    );
};

export default HeroSection;
