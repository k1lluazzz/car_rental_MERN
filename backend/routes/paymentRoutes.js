const express = require('express');
const router = express.Router();
const moment = require('moment');
const Payment = require('../models/Payment');
const vnpayService = require('../services/vnpayService');
const { getRentalPaymentDetails, getPaymentStatus } = require('../controllers/paymentController');

// Add new route for getting rental payment details
router.get('/rental/:rentalId', getRentalPaymentDetails);

// Add new route for checking payment status
router.get('/status/:orderId', getPaymentStatus);

router.post('/create_payment_url', async (req, res) => {
    const { rentalId, amount } = req.body;
    try {
        // Get IP address
        const ipAddr = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const orderId = `${moment().format('HHmmss')}_${Math.random().toString(36).substr(2, 9)}`;
        const payment = new Payment({
            orderId,
            rentalId,
            amount,
            paymentMethod: 'vnpay'
        });
        await payment.save();

        const paymentUrl = vnpayService.createPaymentUrl(
            orderId,
            amount,
            `Thanh toan cho thue xe ${rentalId}`,
            ipAddr
        );
        
        res.json({ paymentUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/vnpay_return', async (req, res) => {
    try {
        const vnpParams = req.query;
        const isValidSignature = vnpayService.verifyReturnUrl(vnpParams);

        if (!isValidSignature) {
            throw new Error('Invalid signature');
        }

        const orderId = vnpParams['vnp_TxnRef'];
        const responseCode = vnpParams['vnp_ResponseCode'];

        const payment = await Payment.findOne({ orderId });
        if (!payment) {
            throw new Error('Payment not found');
        }

        payment.status = responseCode === '00' ? 'completed' : 'failed';
        payment.responseCode = responseCode;
        payment.transactionRef = vnpParams['vnp_TransactionNo'];
        payment.bankCode = vnpParams['vnp_BankCode'];
        payment.paymentDate = new Date();
        await payment.save();

        // Redirect to frontend with status
        res.redirect(`${process.env.FRONTEND_URL}/payment/status?orderId=${orderId}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
