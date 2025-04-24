const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Import middleware
const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'car_images', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file formats
    },
});
const upload = multer({ storage });

// CRUD routes
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', authenticateToken, upload.single('image'), createCar); // Enable token authentication
router.put('/:id', authenticateToken, upload.single('image'), updateCar); // Enable token authentication
router.delete('/:id', authenticateToken, deleteCar); // Temporarily disable token authentication

module.exports = router;
