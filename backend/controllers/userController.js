const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addUser = async (req, res) => {
    const { name, phone, email, password, role } = req.body;
    try {
        console.log('Registration request body:', req.body); // Debug log
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const newUser = new User({ name, phone, email, password, role });
        await newUser.save();
        console.log('User registered successfully:', newUser); // Debug log
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err); // Debug log
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body; // Removed phone
    try {
        console.log('Login attempt with email:', email); // Debug log
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found:', user); // Debug log
        console.log('Password provided:', password); // Debug log
        console.log('User password:', user.password); // Debug log
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            console.log('Password mismatch'); // Debug log
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('Login successful for user:', user.email); // Debug log
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || 'https://via.placeholder.com/150',
            },
        });
    } catch (err) {
        console.error('Error during login:', err); // Debug log
        res.status(500).json({ message: err.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Không thể thay đổi trạng thái của admin' });
        }

        user.status = req.body.status;
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xóa người dùng thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const verifyToken = async (req, res) => {
    // If the request reaches here, it means the token is valid
    // (authenticated by the middleware)
    res.status(200).json({ valid: true });
};

module.exports = {
    getAllUsers,
    addUser,
    loginUser,
    updateUserStatus,
    deleteUser,
    verifyToken
};
