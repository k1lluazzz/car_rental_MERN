const Payment = require('../models/Payment');
const Rental = require('../models/Rental');
const Car = require('../models/Car');

const getRentalPaymentDetails = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.rentalId)
            .populate('car')
            .populate('userId');
        
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        const existingPayment = await Payment.findOne({ rentalId: rental._id });
        if (existingPayment && existingPayment.status === 'completed') {
            return res.status(400).json({ 
                message: 'Payment already completed',
                payment: existingPayment 
            });
        }

        const paymentDetails = {
            rental,
            totalAmount: rental.totalAmount,
            duration: rental.durationInDays,
            car: rental.car,
            user: rental.userId,
            paymentStatus: existingPayment?.status || 'pending'
        };

        res.json(paymentDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        // Include rental information in the response with proper population
        const rental = await Rental.findById(payment.rentalId)
            .populate('car')
            .populate('userId');

        if (!rental) {
            return res.status(404).json({ message: 'Rental information not found' });
        }

        const response = {
            ...payment.toObject(),
            rental,
            userEmail: rental.userId?.email
        };
        
        res.json(response);
    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRentalPaymentDetails,
    getPaymentStatus
};
