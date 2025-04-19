const express = require('express');
const multer = require('multer');
const { getAllCars } = require('../controllers/carController');
const Car = require('../models/Car');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});
const upload = multer({ storage });

// Get all cars
router.get('/', getAllCars);

// Add a new car with an image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, brand, pricePerDay } = req.body;

        // Validate required fields
        if (!name || !brand || !pricePerDay) {
            return res.status(400).json({ message: 'All fields (name, brand, pricePerDay) are required.' });
        }

        const carData = {
            name,
            brand,
            pricePerDay,
            image: req.file ? `/uploads/${req.file.filename}` : undefined,
        };

        const newCar = new Car(carData);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
