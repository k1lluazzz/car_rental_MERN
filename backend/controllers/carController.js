const Car = require('../models/Car');

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const { location, fuelType, seats, name, brand } = req.query;
        const filter = {};

        // Updated location filter to be more flexible
        if (location) {
            filter.location = { 
                $regex: location.trim(), 
                $options: 'i'  // case-insensitive
            };
        }
        if (fuelType) filter.fuelType = fuelType;
        if (seats) filter.seats = parseInt(seats, 10);
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (brand) filter.brand = { $regex: brand, $options: 'i' };

        console.log('Filter:', filter); // Debug log
        const cars = await Car.find(filter);
        console.log('Found cars:', cars.length); // Debug log
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single car by ID
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new car
const createCar = async (req, res) => {
    const carData = req.body;
    if (req.file) {
        carData.image = req.file.path; // Save the Cloudinary URL
    }
    const car = new Car(carData);
    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a car by ID
const updateCar = async (req, res) => {
    try {
        const carData = req.body;
        if (req.file) {
            carData.image = req.file.path; // Save the Cloudinary URL
        }
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, carData, { new: true });
        if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a car by ID
const deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar };
