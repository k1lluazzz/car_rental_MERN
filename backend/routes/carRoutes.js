const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const { authenticateToken } = require('../middleware/authMiddleware');
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

module.exports = router;
