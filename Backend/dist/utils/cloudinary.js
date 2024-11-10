"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldVideo = exports.deleteOldImage = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const ApiError_1 = require("./ApiError");
// Configure Cloudinary with environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Function to upload a file to Cloudinary
const uploadOnCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePath)
            return null;
        const extension = localFilePath.split(".")[1];
        let result;
        if (extension == "mp4") {
            // Use Cloudinary SDK to upload the file
            result = yield cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: "video",
            });
        }
        else {
            result = yield cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: 'image'
            });
        }
        // Delete the file locally after successful upload
        fs_1.default.unlinkSync(localFilePath);
        return result.secure_url; // Return the secure URL from Cloudinary
    }
    catch (err) {
        console.error("Error uploading to Cloudinary:", err);
        // Remove the local file even if the upload fails
        if (fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath);
        }
        throw err; // Propagate the error to be handled by the calling function
    }
});
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteOldImage = (linkOfPath) => __awaiter(void 0, void 0, void 0, function* () {
    // if(!linkOfPath) return;
    try {
        const image = linkOfPath.split("/")[7].split(".")[0];
        const result = yield cloudinary_1.v2.uploader.destroy(image, (error, result) => {
            return result;
        });
        if (!result)
            throw new ApiError_1.ApiError(404, "Image Error");
        return result;
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, error.message);
    }
});
exports.deleteOldImage = deleteOldImage;
const deleteOldVideo = (linkOfPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = linkOfPath.split("/")[7].split(".")[0];
        const result = yield cloudinary_1.v2.uploader.destroy(video, { resource_type: 'video' });
        return result.result;
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, error.message);
    }
});
exports.deleteOldVideo = deleteOldVideo;
