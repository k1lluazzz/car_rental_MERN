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
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ message: 'Đơn thuê không tồn tại' });
        }

        rental.status = req.body.status;
        await rental.save();
        
        res.json(rental);
    } catch (err) {
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
                select: 'name brand image pricePerDay'
            })
            .sort({ createdAt: -1 });
        
        console.log('Found rentals for user:', userRentals.length);
        res.json(userRentals);
    } catch (err) {
        console.error('Error in getUserRentals:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    getAllRentals, 
    addRental, 
    updateRentalStatus,
    getUserRentals 
};
