const express = require('express');
const { getAllUsers, addUser, loginUser } = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only route to get all users
router.get('/', authenticateToken, isAdmin, getAllUsers);

// User registration and login remain public
router.post('/register', addUser);
router.post('/login', loginUser);

module.exports = router;
