require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const carRoutes = require('./routes/carRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Server is running'); // Add this route for testing
});

// Use environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));