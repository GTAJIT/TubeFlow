import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        // Use Cloudinary SDK to upload the file
        const result = await cloudinary.uploader.upload(localFilePath);

        // Delete the file locally after successful upload
        fs.unlinkSync(localFilePath);

        return result.secure_url; // Return the secure URL from Cloudinary
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);

        // Remove the local file even if the upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw err; // Propagate the error to be handled by the calling function
    }
};

export default uploadOnCloudinary;
