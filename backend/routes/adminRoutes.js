const express = require('express');
const router = express.Router();
const { getSystemStats, getMonthlyRevenue } = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken, isAdmin);

router.get('/stats', getSystemStats);
router.get('/revenue', getMonthlyRevenue);

module.exports = router;
