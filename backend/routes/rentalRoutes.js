const express = require('express');
const { getAllRentals, addRental, updateRentalStatus } = require('../controllers/rentalController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const Rental = require('../models/Rental');
const router = express.Router();

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllRentals);
router.patch('/:id/status', authenticateToken, isAdmin, updateRentalStatus);

// User routes
router.post('/book', authenticateToken, async (req, res) => {
    const { car, userName, startDate, endDate } = req.body;
    try {
        const isAvailable = await Rental.isCarAvailable(car, new Date(startDate), new Date(endDate));
        if (!isAvailable) {
            return res.status(400).json({ message: 'Car is not available for the selected dates.' });
        }

        const newRental = new Rental({ car, userName, startDate, endDate });
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
