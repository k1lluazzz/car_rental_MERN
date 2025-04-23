import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const BookingPage = () => {
    const { id } = useParams(); // Car ID from the URL
    const [car, setCar] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({
        userName: '',
        startDate: '',
        endDate: '',
    });

    // Fetch car details
    useEffect(() => {
        axios.get(`http://localhost:5000/api/cars/${id}`)
            .then(response => setCar(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails({ ...bookingDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/rentals', {
                car: id,
                ...bookingDetails,
            });
            alert('Booking successful!');
        } catch (err) {
            console.error(err);
            alert('Failed to book the car.');
        }
    };

    if (!car) {
        return <Typography>Loading car details...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                Book {car.name}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Your Name"
                    name="userName"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Confirm Booking
                </Button>
            </form>
        </Box>
    );
};

export default BookingPage;
