"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilePath = exports.videoUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path")); // This is key for file extension handling
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname); // Get the original file extension
        cb(null, path_1.default.basename(file.originalname, ext) + '-' + uniqueSuffix + ext); // Preserve the extension
    }
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
});
exports.videoUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if ((file.fieldname === 'thumbnail' && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) ||
            (file.fieldname === 'video' && file.mimetype === 'video/mp4')) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    }
});
const deleteFilePath = (localFilePath) => {
    if (fs_1.default.existsSync(localFilePath)) {
        fs_1.default.unlinkSync(localFilePath);
    }
};
exports.deleteFilePath = deleteFilePath;
