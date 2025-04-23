import React, { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Popover, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

const HeroSection = () => {
    const [locationAnchor, setLocationAnchor] = useState(null);
    const [timeAnchor, setTimeAnchor] = useState(null);
    const [defaultTime, setDefaultTime] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        duration: '',
    });
    const [rentalType, setRentalType] = useState('day'); // 'day' or 'hour'

    const handleLocationClick = (event) => {
        setLocationAnchor(event.currentTarget);
    };

    const handleTimeClick = (event) => {
        setTimeAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setLocationAnchor(null);
        setTimeAnchor(null);
    };

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
            setDefaultTime(
                `${startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${startDate.toLocaleDateString('en-GB')} - ${duration} giờ`
            );
        }
        setTimeAnchor(null);
    };

    const handleRentalTypeChange = (event, newType) => {
        if (newType !== null) {
            setRentalType(newType);
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    backgroundImage: 'url(src/logo.png)', // Updated path
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#000000' }}>
                    HDoto - Cùng Bạn Đến Mọi Hành Trình
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: '30px', color: '#000000' }}>
                    Trải nghiệm sự khác biệt từ hơn <span style={{ color: '#00b14f' }}>10.000</span> xe gia đình đời mới khắp Việt Nam
                </Typography>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        width: '80%',
                        maxWidth: '900px',
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#000000' }}>
                            Địa điểm
                        </Typography>
                        <TextField
                            select
                            variant="outlined"
                            fullWidth
                            defaultValue="Hà Nội"
                            onClick={handleLocationClick}
                        >
                            <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                            <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                            <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ flex: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#000000' }}>
                            Thời gian thuê
                        </Typography>
                        <TextField
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={defaultTime || `${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${today.toLocaleDateString('en-GB')} - ${tomorrow.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${tomorrow.toLocaleDateString('en-GB')}`}
                            onClick={handleTimeClick}
                        />
                        <Popover
                            open={Boolean(timeAnchor)}
                            anchorEl={timeAnchor}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Box sx={{ padding: '10px', color: '#000000' }}>
                                <ToggleButtonGroup
                                    value={rentalType}
                                    exclusive
                                    onChange={handleRentalTypeChange}
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
                        </Popover>
                    </Box>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ padding: '10px 30px',marginTop: '20px' , fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                        Tìm Xe
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default HeroSection;
