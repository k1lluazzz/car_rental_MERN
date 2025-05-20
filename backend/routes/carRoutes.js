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
        transformation: [{ width: 800, height: 600, crop: "limit" }],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `car-${uniqueSuffix}`;
        }
    }
});

// Configure multer
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        console.log('Processing file upload:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });

        // Accept only jpeg, jpg and png
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            const error = new Error('Only .png, .jpg and .jpeg format allowed!');
            console.error('File upload error:', error.message);
            cb(error);
        }
    }
}); // Do not call .single('image') here

// Wrapper for handling multer errors
const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', {
                message: err.message,
                stack: err.stack,
                code: err.code
            });
            return res.status(400).json({
                message: 'Error uploading file',
                error: err.message
            });
        }
        console.log('File upload successful:', req.file);
        next();
    });
};

// CRUD routes
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', authenticateToken, handleUpload, createCar);
router.put('/:id', authenticateToken, handleUpload, updateCar);
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
