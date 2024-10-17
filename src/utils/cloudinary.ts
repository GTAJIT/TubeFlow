import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiError';

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

const deleteOldImage = async(linkOfPath: string)=>{
    // if(!linkOfPath) return;
    try {
        const image = linkOfPath.split("/")[7].split(".")[0];
        const result = await cloudinary.uploader.destroy(image, (error, result) => {
            return result;
        });
        if(!result) throw new ApiError(404, "Image Error")
        return result
    } catch (error: any) {
        throw new ApiError(400, error.message)
    }
}

export {uploadOnCloudinary, deleteOldImage};
