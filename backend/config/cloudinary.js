const { v2: cloudinary } = require('cloudinary');

// Validate Cloudinary configuration
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required Cloudinary environment variables:', missingEnvVars);
    console.error('Current environment variables:', {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '****' : undefined,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '****' : undefined
    });
    throw new Error(`Missing required Cloudinary configuration: ${missingEnvVars.join(', ')}`);
}

// Configure Cloudinary with environment variables
try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });

    console.log('Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
} catch (error) {
    console.error('Error configuring Cloudinary:', error);
    throw error;
}

module.exports = cloudinary;
