import React, { useState } from 'react';
import axios from 'axios';

const CarForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        pricePerDay: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('pricePerDay', formData.pricePerDay);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await axios.post('http://localhost:5000/api/cars', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Car added successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to add car.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Car Name" onChange={handleChange} required />
            <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
            <input type="number" name="pricePerDay" placeholder="Price Per Day" onChange={handleChange} required />
            <input type="file" name="image" onChange={handleFileChange} />
            <button type="submit">Add Car</button>
        </form>
    );
};

export default CarForm;
