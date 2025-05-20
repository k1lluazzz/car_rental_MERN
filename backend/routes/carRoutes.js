const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const { getAllCars, getCarById, createCar, updateCar, deleteCar, addTestReview } = require('../controllers/carController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const Car = require('../models/Car');
const Rental = require('../models/Rental');
const router = express.Router();

// Configure Cloudinary storage
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'car_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 800, height: 600, crop: "limit" }]
    }
});

// Configure multer
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only jpeg, jpg and png
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// CRUD routes
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', authenticateToken, upload.single('image'), createCar);
router.put('/:id', authenticateToken, upload.single('image'), updateCar);
router.delete('/:id', authenticateToken, deleteCar);

// Test route for adding reviews (temporary)
router.post('/:id/test-review', addTestReview);

// Update statistics for all cars
router.post('/update-statistics', authenticateToken, isAdmin, async (req, res) => {
    try {
        const cars = await Car.find();
        for (const car of cars) {
            const completedRentals = await Rental.countDocuments({
                car: car._id,
                status: { $in: ['completed', 'returned'] }
            });
            
            car.trips = completedRentals;
            await car.save();
        }
        res.json({ message: 'Car statistics updated successfully' });
    } catch (error) {
        console.error('Error updating car statistics:', error);
        res.status(500).json({ message: 'Error updating car statistics' });
    }
});

module.exports = router;
