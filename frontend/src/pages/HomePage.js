import React, { useEffect, useState } from 'react';
import { Container, Typography, Pagination, Box } from '@mui/material';
import CarCard from '../components/CarCard';
import axios from 'axios';

const HomePage = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 10; // 5 cars per row, 2 rows per page

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars')
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Calculate the cars to display on the current page
    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

    return (
        <Container sx={{ marginTop: '20px' }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    textAlign: 'center', // Center the title
                }}
            >
                Xe dành cho bạn
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'space-between',
                }}
            >
                {currentCars.map(car => (
                    <Box
                        key={car._id}
                        sx={{
                            flex: '1 1 calc(20% - 20px)', // 20% width for 5 items per row, minus gap
                            maxWidth: 'calc(20% - 20px)',
                        }}
                    >
                        <CarCard car={car} />
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}> 
                <Pagination
                    count={Math.ceil(cars.length / carsPerPage)}
                    page={currentPage} // Ensure the current page is highlighted
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default HomePage;
