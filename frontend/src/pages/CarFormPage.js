import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const CarFormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        price: '',
        available: true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'available' ? value === 'true' : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={formData.name}
                onChange={handleChange}
            />
            <TextField
                label="Model"
                name="model"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={formData.model}
                onChange={handleChange}
            />
            <TextField
                label="Price"
                name="price"
                type="number"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={formData.price}
                onChange={handleChange}
            />
            <TextField
                label="Available"
                name="available"
                select
                variant="outlined"
                fullWidth
                sx={{ marginBottom: '20px' }}
                value={formData.available}
                onChange={handleChange}
                SelectProps={{
                    native: true,
                }}
            >
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
            </TextField>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
};

export default CarFormPage;