const Car = require('../models/Car');

// Function to calculate total trips for a car
const calculateTotalTrips = async (carId) => {
    const Rental = require('../models/Rental');
    return await Rental.countDocuments({
        car: carId,
        status: { $ne: 'cancelled' }  // Count all statuses except cancelled
    });
};

// Function to update car statistics
const updateCarStatistics = async (carId) => {
    try {
        const Car = require('../models/Car');
        
        // Update car's trip count
        const car = await Car.findById(carId);
        if (car) {
            car.trips = await calculateTotalTrips(carId);
            await car.save();
        }
    } catch (error) {
        console.error('Error updating car statistics:', error);
    }
};

// Get all cars
const getAllCars = async (req, res) => {
    try {
        const { location, fuelType, seats, name, brand } = req.query;
        const filter = {};

        if (location) {
            filter.location = { 
                $regex: location.trim(), 
                $options: 'i'
            };
        }
        if (fuelType) filter.fuelType = fuelType;
        if (seats) filter.seats = parseInt(seats, 10);
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (brand) filter.brand = { $regex: brand, $options: 'i' };

        // Get all cars including reviews
        const cars = await Car.find(filter);
          // Calculate rating and trips for each car
        const carsWithStats = await Promise.all(cars.map(async car => {
            const carObj = car.toObject();
            
            // Calculate rating
            if (car.reviews && car.reviews.length > 0) {
                const totalRating = car.reviews.reduce((sum, review) => sum + review.rating, 0);
                carObj.rating = Math.round((totalRating / car.reviews.length) * 10) / 10;
                carObj.totalRatings = car.reviews.length;
            } else {
                carObj.rating = 0;
                carObj.totalRatings = 0;
            }            
            // Calculate total trips (all bookings except cancelled ones)
            carObj.trips = await calculateTotalTrips(car._id);

            return carObj;
        }));        
        res.json(carsWithStats);
    } catch (err) {
        console.error('Error in getAllCars:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single car by ID
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });        
        const carObj = car.toObject();
        
        // Calculate average rating if car has reviews
        if (car.reviews && car.reviews.length > 0) {
            const totalRating = car.reviews.reduce((sum, review) => sum + review.rating, 0);
            carObj.rating = Math.round((totalRating / car.reviews.length) * 10) / 10;
            carObj.totalRatings = car.reviews.length;
        } else {
            carObj.rating = 0;
            carObj.totalRatings = 0;
        }

        // Calculate trips
        carObj.trips = await calculateTotalTrips(car._id);

        res.json(carObj);
    } catch (err) {
        console.error('Error in getCarById:', err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new car
const createCar = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.name || !req.body.brand || !req.body.pricePerDay || 
            !req.body.transmission || !req.body.seats || !req.body.fuelType || 
            !req.body.location) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                requiredFields: ['name', 'brand', 'pricePerDay', 'transmission', 'seats', 'fuelType', 'location']
            });
        }

        const carData = { ...req.body };
        
        // Convert string values to appropriate types
        if (carData.pricePerDay) {
            carData.pricePerDay = Number(carData.pricePerDay);
        }
        if (carData.seats) {
            carData.seats = Number(carData.seats);
        }

        // Handle image upload
        if (req.file) {
            console.log('Uploaded file:', req.file);
            carData.image = req.file.path;
        }

        const car = new Car(carData);
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (err) {
        console.error('Error in createCar:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error', 
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Error creating car', error: err.message });
    }
};

// Update a car by ID
const updateCar = async (req, res) => {
    try {
        const carData = { ...req.body };
        
        // Convert string values to appropriate types
        if (carData.pricePerDay) {
            carData.pricePerDay = Number(carData.pricePerDay);
        }
        if (carData.seats) {
            carData.seats = Number(carData.seats);
        }

        // Handle image upload
        if (req.file) {
            console.log('Uploaded file:', req.file);
            carData.image = req.file.path;
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id, 
            carData,
            { new: true, runValidators: true }
        );

        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.json(updatedCar);
    } catch (err) {
        console.error('Error in updateCar:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error', 
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Error updating car', error: err.message });
    }
};

// Delete a car by ID
const deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        console.error('Error in deleteCar:', err);
        res.status(500).json({ message: err.message });
    }
};

// Add a test review (temporary function)
const addTestReview = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });

        // Initialize reviews array if it doesn't exist
        if (!car.reviews) {
            car.reviews = [];
        }

        // Add test reviews
        car.reviews.push(
            {
                rating: 4,
                comment: "Good car",
                user: "648309012345678901234567",
                date: new Date()
            },
            {
                rating: 5,
                comment: "Excellent service",
                user: "648309012345678901234567",
                date: new Date()
            },
            {
                rating: 5,
                comment: "Very clean and well maintained",
                user: "648309012345678901234567",
                date: new Date()
            }
        );

        // Calculate new rating
        const totalRating = car.reviews.reduce((sum, review) => sum + review.rating, 0);
        car.rating = Math.round((totalRating / car.reviews.length) * 10) / 10;
        car.totalRatings = car.reviews.length;

        await car.save();
        res.json(car);
    } catch (err) {
        console.error('Error in addTestReview:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar, addTestReview };
