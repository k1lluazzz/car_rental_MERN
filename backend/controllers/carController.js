const Car = require('../models/Car');
const { v2: cloudinary } = require('cloudinary');

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
        console.log('Creating new car with body:', req.body);
        console.log('File in request:', req.file);
        
        const requiredFields = ['name', 'brand', 'pricePerDay', 'transmission', 'seats', 'fuelType', 'location'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields',
                requiredFields: missingFields,
                receivedFields: Object.keys(req.body)
            });
        }

        const carData = { ...req.body };
        
        // Convert string values to appropriate types
        if (carData.pricePerDay) {
            carData.pricePerDay = Number(carData.pricePerDay);
        }
        if (carData.seats) {
            carData.seats = Number(carData.seats);
        }        // Handle image upload from Cloudinary
        if (req.file) {
            try {
                console.log('Uploaded file:', req.file);
                if (!req.file.path) {
                    throw new Error('No file path received from Cloudinary');
                }
                carData.image = req.file.path; // Cloudinary URL is in req.file.path
                console.log('Image URL:', carData.image);
            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ 
                    message: 'Error uploading image',
                    error: uploadError.message
                });
            }
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
        const { id } = req.params;
        const updateData = { ...req.body };

        // Find existing car
        const existingCar = await Car.findById(id);
        if (!existingCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Convert string values to appropriate types
        if (updateData.pricePerDay) {
            updateData.pricePerDay = Number(updateData.pricePerDay);
        }
        if (updateData.seats) {
            updateData.seats = Number(updateData.seats);
        }

        // Handle new image upload
        if (req.file) {
            // Extract public_id from old image URL if it exists
            if (existingCar.image) {
                const publicId = existingCar.image.split('/').slice(-1)[0].split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Old image deleted from Cloudinary');
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }
            updateData.image = req.file.path;
        }

        // Update car with new data
        const updatedCar = await Car.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

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
        const { id } = req.params;
        
        // Find car before deleting to get image URL
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Delete image from Cloudinary if it exists
        if (car.image) {
            const publicId = car.image.split('/').slice(-1)[0].split('.')[0];
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log('Image deleted from Cloudinary');
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
            }
        }

        // Delete car from database
        await Car.findByIdAndDelete(id);
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        console.error('Error in deleteCar:', err);
        res.status(500).json({ message: 'Error deleting car', error: err.message });
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
