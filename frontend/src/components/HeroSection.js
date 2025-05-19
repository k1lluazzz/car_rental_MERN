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
    const [rentalType, setRentalType] = useState('day');
    const [selectedLocation, setSelectedLocation] = useState('Hà Nội');    const [isHovered, setIsHovered] = useState(false);
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
            navigate(`/cars?location=${encodeURIComponent(selectedLocation)}`); // Navigate to CarSearchResultsPage
        } else {
            alert('Vui lòng chọn khu vực.');
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>            <Box
                sx={{
                    height: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    margin: '0 auto',
                    padding: '0 20px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: { xs: '0', md: '30px' },
                    maxWidth: '1400px',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url(./images/background_image.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.5)',
                        transition: 'transform 0.3s ease-out',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        zIndex: 0
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >                <Box
                    sx={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }}
                >
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        Thuê Xe Tự Lái
                    </Typography>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 4,
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 300,
                            maxWidth: '800px',
                            margin: '0 auto',
                            lineHeight: 1.6
                        }}
                    >
                        Trải nghiệm lái xe an toàn và tiện lợi với dịch vụ cho thuê xe tự lái của chúng tôi
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
                        HDOTO - Cùng Bạn Đến Mọi Hành Trình
                    </Typography>
                </Box>

                {/* Floating Box */}                <Box
                    sx={{
                        position: 'relative',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: { xs: '20px', md: '30px' },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: '20px', md: '30px' },
                        alignItems: 'center',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        width: '95%',
                        maxWidth: '1000px',
                        margin: '0 auto',
                        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
                        }
                    }}
                >                    <Box sx={{ 
                        flex: 1,
                        width: '100%'
                    }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                marginBottom: '8px',
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 500
                            }}
                        >
                            <LocationOnIcon color="primary" />
                            Địa điểm
                        </Typography>
                        <TextField
                            select
                            variant="outlined"
                            fullWidth
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#fff',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff',
                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                    }
                                }
                            }}
                        >
                            <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                            <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                            <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>                        </TextField>
                    </Box>
                    <Box sx={{ 
                        flex: 2,
                        width: '100%'
                    }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                marginBottom: '8px',
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 500
                            }}
                        >
                            <CalendarMonthIcon color="primary" />
                            Thời gian thuê
                        </Typography>
                        <TextField
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={defaultTime || `${today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${today.toLocaleDateString('en-GB')} - ${tomorrow.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}, ${tomorrow.toLocaleDateString('en-GB')}`}                            onClick={() => setTimeModalOpen(true)}
                            InputProps={{
                                sx: {
                                    borderRadius: '12px',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff',
                                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                    }
                                }
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            borderRadius: '12px',
                            marginTop: '32px',
                            padding: '12px 32px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .3)'
                            }
                        }}
                    >
                        Tìm Xe Ngay
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
