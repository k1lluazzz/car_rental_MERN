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

// Get a single rental by ID
router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
            .populate('car');
            
        if (!rental) {
            return res.status(404).json({ message: 'Đơn thuê xe không tồn tại' });
        }

        res.json(rental);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/book', async (req, res) => {
    const { car, userName, startDate, endDate } = req.body;

    try {
        const isAvailable = await Rental.isCarAvailable(car, new Date(startDate), new Date(endDate));
        if (!isAvailable) {
            return res.status(400).json({ message: 'Car is not available for the selected dates.' });
        }

        // Create rental without optional fields - they'll be calculated in pre-save
        const newRental = new Rental({ car, userName, startDate, endDate });
        await newRental.save();

        // Populate car details in response
        const populatedRental = await Rental.findById(newRental._id).populate('car');
        res.status(201).json(populatedRental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add new endpoint for user bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const rentals = await Rental.find({ 
            userId: req.params.userId,
            $or: [
                { status: 'pending' },
                { status: 'unpaid' }
            ]
        }).populate('car');
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
