const express = require('express');
const { getAllRentals, addRental } = require('../controllers/rentalController');
const router = express.Router();

router.get('/', getAllRentals);
router.post('/', addRental);

module.exports = router;
