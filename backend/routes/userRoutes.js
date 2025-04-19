const express = require('express');
const { getAllUsers, addUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', addUser);
router.post('/login', loginUser);

module.exports = router;
