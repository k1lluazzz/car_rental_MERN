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

module.exports = router;
