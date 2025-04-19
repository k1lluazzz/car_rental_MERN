import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const RentalTable = () => {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/rentals') // Ensure this matches your backend URL
            .then(response => setRentals(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <TableContainer component={Paper} style={{ margin: '20px', padding: '20px' }}>
            <Typography variant="h6" component="div" style={{ marginBottom: '10px' }}>
                Rental List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell>Car Name</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rentals.map(rental => (
                        <TableRow key={rental._id}>
                            <TableCell>{rental.user?.name || 'Unknown'}</TableCell>
                            <TableCell>{rental.car?.name || 'Unknown'}</TableCell>
                            <TableCell>{new Date(rental.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(rental.endDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(rental.endDate) > new Date() ? 'Active' : 'Completed'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RentalTable;
