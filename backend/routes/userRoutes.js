const express = require('express');
const { getAllUsers, addUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', addUser);

// Register a new user
router.post('/register', addUser);

// Login a user
router.post('/login', loginUser);

module.exports = router;
