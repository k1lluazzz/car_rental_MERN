const express = require('express');
const { getAllRentals } = require('../controllers/rentalController');
const Rental = require('../models/Rental');
const router = express.Router();

router.get('/', getAllRentals);

// Create a new rental
router.post('/', async (req, res) => {
    const { car, userName, startDate, endDate } = req.body;
    try {
        const newRental = new Rental({ car, userName, startDate, endDate });
        await newRental.save();
        res.status(201).json(newRental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/book', async (req, res) => {
    const { car, userName, startDate, endDate } = req.body;

    try {
        const isAvailable = await Rental.isCarAvailable(car, new Date(startDate), new Date(endDate));
        if (!isAvailable) {
            return res.status(400).json({ message: 'Car is not available for the selected dates.' });
        }

        const newRental = new Rental({ car, userName, startDate, endDate });
        await newRental.save();
        res.status(201).json(newRental);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
