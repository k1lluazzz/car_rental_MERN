const express = require('express');
const { 
    getAllRentals, 
    addRental, 
    updateRentalStatus, 
    getUserRentals,
    returnCar,
    addReview
} = require('../controllers/rentalController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const Rental = require('../models/Rental');
const Car = require('../models/Car'); // Import Car model
const router = express.Router();

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllRentals);
router.patch('/:id/status', authenticateToken, isAdmin, updateRentalStatus);

// User routes
router.get('/my-rentals', authenticateToken, getUserRentals);
router.post('/:id/return', authenticateToken, returnCar);
router.post('/:id/review', authenticateToken, addReview);

router.post('/:id/change-car', authenticateToken, async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;
        if (!carId) {
            return res.status(400).json({ message: 'Car ID is required' });
        }

        const oldRental = await Rental.findById(req.params.id);
        if (!oldRental) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        // Verify ownership
        if (oldRental.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newStartDate = startDate ? new Date(startDate) : oldRental.startDate;
        const newEndDate = endDate ? new Date(endDate) : oldRental.endDate;

        // Check if the car is available for these dates
        const isAvailable = await Rental.isCarAvailable(carId, newStartDate, newEndDate);
        if (!isAvailable) {
            return res.status(400).json({ message: 'Selected car is not available for these dates' });
        }

        // Update the current rental to use the new car and dates
        oldRental.car = carId;
        oldRental.startDate = newStartDate;
        oldRental.endDate = newEndDate;
        oldRental.status = 'unpaid';  // Reset to unpaid since it's a new car and possibly new duration
        
        // Recalculate duration and prices
        const start = new Date(newStartDate);
        const end = new Date(newEndDate);
        const durationMs = end.getTime() - start.getTime();
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        
        oldRental.durationInDays = durationDays;
        oldRental.originalPrice = car.pricePerDay * durationDays;
        oldRental.totalPrice = car.discount > 0 
            ? oldRental.originalPrice * (1 - car.discount / 100) 
            : oldRental.originalPrice;
        oldRental.totalAmount = oldRental.totalPrice;

        await oldRental.save();

        const updatedRental = await Rental.findById(oldRental._id).populate('car');
        res.json(updatedRental);
    } catch (err) {
        console.error('Error changing car:', err);
        res.status(500).json({ message: err.message });
    }
});
router.post('/book', authenticateToken, async (req, res) => {
    const { car: carId, userName, startDate, endDate, originalPrice, totalPrice, durationInDays, discount } = req.body;
    try {
        const isAvailable = await Rental.isCarAvailable(carId, new Date(startDate), new Date(endDate));
        if (!isAvailable) {
            return res.status(400).json({ message: 'Car is not available for the selected dates.' });
        }
        
        // Create rental with all required fields
        const newRental = new Rental({ 
            car: carId, 
            userName, 
            startDate, 
            endDate,
            userId: req.user.id,
            status: 'unpaid',
            originalPrice,
            totalPrice,
            totalAmount: totalPrice,
            durationInDays,
            discount
        });
        await newRental.save();
        const populatedRental = await Rental.findById(newRental._id).populate('car');
        res.status(201).json(populatedRental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get user's own rentals
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        // Only allow users to see their own rentals or admins to see any user's rentals
        if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

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
// Thêm route để lấy thông tin chi tiết đơn thuê xe theo ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).populate('car');
        
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        
        // Kiểm tra quyền truy cập (chỉ cho phép admin hoặc chủ sở hữu đơn thuê xe)
        // Đảm bảo kiểm tra tồn tại của userId
        if (req.user.role !== 'admin' && rental.userId && req.user.id && 
            rental.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(rental);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
