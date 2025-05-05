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

module.exports = { 
    getAllRentals, 
    addRental, 
    updateRentalStatus 
};
