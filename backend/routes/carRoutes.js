const express = require('express');
const multer = require('multer');
const { getAllCars, getCarById, createCar, updateCar, deleteCar } = require('../controllers/carController');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// CRUD routes
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', upload.single('image'), createCar);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);

module.exports = router;
