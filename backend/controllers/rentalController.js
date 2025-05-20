const Rental = require('../models/Rental');

const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find().populate('car');
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addRental = async (req, res) => {
    const rental = new Rental(req.body);
    try {
        const newRental = await rental.save();
        res.status(201).json(newRental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateRentalStatus = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).populate('car');
        if (!rental) {
            return res.status(404).json({ message: 'Đơn thuê không tồn tại' });
        }

        const oldStatus = rental.status;
        rental.status = req.body.status;
        await rental.save();

        // If status is being changed to 'completed' or 'returned', update car's trip count
        if (['completed', 'returned'].includes(req.body.status) && !['completed', 'returned'].includes(oldStatus)) {
            const Car = require('../models/Car');
            const car = await Car.findById(rental.car._id);
            car.trips = (car.trips || 0) + 1;  // Increment trips, default to 0 if undefined
            await car.save();
        }
        
        res.json(rental);
    } catch (err) {
        console.error('Error in updateRentalStatus:', err);
        res.status(400).json({ message: err.message });
    }
};

const getUserRentals = async (req, res) => {
    try {
        console.log('Getting rentals for user:', req.user.id);
        // First check if any rentals exist at all
        const allRentals = await Rental.find();
        console.log('Total rentals in system:', allRentals.length);
          const userRentals = await Rental.find({ userId: req.user.id })
            .populate({
                path: 'car',
                select: 'name brand image pricePerDay rating totalRatings trips'
            })
            .sort({ createdAt: -1 });
        
        console.log('Found rentals for user:', userRentals.length);
        res.json(userRentals);
    } catch (err) {
        console.error('Error in getUserRentals:', err);
        res.status(500).json({ message: err.message });
    }
};

const returnCar = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ message: 'Đơn thuê không tồn tại' });
        }

        // Check if user owns this rental
        if (rental.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        // Check if rental is in valid state for return
        if (rental.status !== 'completed') {
            return res.status(400).json({ message: 'Đơn thuê không ở trạng thái có thể trả xe' });
        }

        // Update rental with return details
        rental.status = 'returned';
        rental.returnDetails = {
            returnDate: new Date(),
            condition: req.body.condition,
            notes: req.body.notes
        };

        await rental.save();
        
        res.json(rental);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const addReview = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ message: 'Đơn thuê không tồn tại' });
        }

        // Check if user owns this rental
        if (rental.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
        }

        // Check if rental is completed or returned
        if (!['completed', 'returned'].includes(rental.status)) {
            return res.status(400).json({ message: 'Chỉ có thể đánh giá sau khi hoàn thành thuê xe' });
        }

        // Check if already reviewed
        if (rental.review && rental.review.rating) {
            return res.status(400).json({ message: 'Đã đánh giá cho đơn thuê này' });
        }

        // Validate rating value
        const rating = parseFloat(req.body.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
        }

        // Add review to rental
        rental.review = {
            rating: rating,
            comment: req.body.comment,
            createdAt: new Date()
        };

        await rental.save();

        // Update car's reviews and rating
        const Car = require('../models/Car');
        const car = await Car.findById(rental.car);
        
        // Initialize car reviews array if it doesn't exist
        if (!car.reviews) {
            car.reviews = [];
        }

        // Add the new review
        car.reviews.push({
            rating: rating,
            comment: req.body.comment,
            user: req.user.id,
            date: new Date()
        });

        // Calculate new average rating with one decimal place
        // Use reduce for accuracy with floating-point numbers
        const totalRating = car.reviews.reduce((sum, review) => sum + review.rating, 0);
        car.rating = Math.round((totalRating / car.reviews.length) * 10) / 10;
        car.totalRatings = car.reviews.length;

        await car.save();

        // Return the updated rental with car details
        const updatedRental = await Rental.findById(rental._id).populate('car');
        res.json(updatedRental);
    } catch (err) {
        console.error('Error in addReview:', err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { 
    getAllRentals, 
    addRental, 
    updateRentalStatus,
    getUserRentals,
    returnCar,
    addReview
};
