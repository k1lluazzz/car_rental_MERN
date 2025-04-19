const Rental = require('../models/Rental');

const getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find().populate('car user');
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

module.exports = { getAllRentals, addRental };
