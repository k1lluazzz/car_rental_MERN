import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import CarList from '../components/CarList';
import CarForm from '../components/CarForm';
import EditCarForm from '../components/EditCarForm';
import axios from 'axios';

const HomePage = () => {
    const [cars, setCars] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars')
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleAddCar = (newCar) => {
        setCars([...cars, newCar]);
        setIsAdding(false);
    };

    const handleUpdateCar = (updatedCar) => {
        setCars(cars.map(car => (car._id === updatedCar._id ? updatedCar : car)));
        setEditingCar(null);
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                Manage Cars
            </Typography>
            {isLoggedIn && (
                <Button variant="contained" color="primary" onClick={() => setIsAdding(true)}>
                    Add New Car
                </Button>
            )}
            {isAdding && <CarForm onClose={() => setIsAdding(false)} onAdd={handleAddCar} />}
            {editingCar && (
                <EditCarForm
                    car={editingCar}
                    onClose={() => setEditingCar(null)}
                    onUpdate={handleUpdateCar}
                />
            )}
            <CarList cars={cars} onEdit={setEditingCar} />
        </Container>
    );
};

export default HomePage;
