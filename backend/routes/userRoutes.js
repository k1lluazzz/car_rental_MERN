const express = require('express');
const router = express.Router();
const { getAllUsers, addUser, loginUser, updateUserStatus, deleteUser, verifyToken } = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', addUser);
router.post('/login', loginUser);

// Token verification route
router.get('/verify', authenticateToken, verifyToken);

// Protected routes - require admin access
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.patch('/:id/status', authenticateToken, isAdmin, updateUserStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
