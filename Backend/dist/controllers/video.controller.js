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
exports.increaseViewsCount = exports.getVideosOfChannel = exports.watchHistory = exports.getAllVideos = exports.deleteVideo = exports.updateVideo = exports.getVideoById = exports.togglePublishStatus = exports.uploadVideo = void 0;
const db_1 = __importDefault(require("../db/db"));
const multer_middleware_1 = require("../middlewares/multer.middleware");
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const get_video_duration_1 = require("get-video-duration");
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const uploadVideo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new ApiError_1.ApiError(401, "Unauthorized Access");
        }
        const { title, description } = req.body;
        console.log(req.files);
        const { video, thumbnail } = req.files;
        const videoUpload = yield (0, cloudinary_1.uploadOnCloudinary)(video[0].path);
        if (!videoUpload)
            throw new ApiError_1.ApiError(404, "Video cannot be uploaded");
        const thumbnailUpload = yield (0, cloudinary_1.uploadOnCloudinary)(thumbnail[0].path);
        if (!thumbnailUpload)
            throw new ApiError_1.ApiError(404, "Thumbnail cannot be uploaded");
        const duration = yield (0, get_video_duration_1.getVideoDurationInSeconds)(videoUpload);
        if (!duration)
            throw new ApiError_1.ApiError(404, "Duration error");
        const result = yield db_1.default.video.create({
            data: {
                videoFile: videoUpload,
                thumbnail: thumbnailUpload,
                userId: userId,
                title: title.toLowerCase(),
                description: description.toLowerCase(),
                isPublished: false,
                duration: duration
            }
        });
        if (!result)
            throw new ApiError_1.ApiError(404, "Upload Unsuccessful");
        (0, multer_middleware_1.deleteFilePath)(video[0].path);
        (0, multer_middleware_1.deleteFilePath)(thumbnail[0].path);
        res.json({
            message: result
        });
    }
    catch (error) {
        console.log(error);
        //@ts-ignore
        throw new ApiError_1.ApiError(404, error);
    }
}));
exports.uploadVideo = uploadVideo;
const togglePublishStatus = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { videoId } = req.params;
    if (!userId)
        throw new ApiError_1.ApiError(401, "Unauthorized");
    if (!videoId)
        throw new ApiError_1.ApiError(403, "Forbidden");
    // if(!id) throw new ApiError(403, "Forbidden")    
    const status = yield db_1.default.video.findMany({
        where: {
            id: parseInt(videoId),
        },
        select: {
            isPublished: true
        }
    });
    const toggle = yield db_1.default.video.update({
        where: {
            id: parseInt(videoId)
        },
        data: {
            isPublished: !status[0].isPublished
        }
    });
    res.json({
        message: toggle
    });
}));
exports.togglePublishStatus = togglePublishStatus;
const getVideoById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const result = yield db_1.default.video.findUnique({
        where: {
            id: parseInt(videoId)
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "Video Not Found");
    res.status(200).json({
        result
    });
}));
exports.getVideoById = getVideoById;
const updateVideo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    // Parse videoId as integer safely
    const videoIdInt = parseInt(videoId, 10);
    if (isNaN(videoIdInt)) {
        throw new ApiError_1.ApiError(400, "Invalid video ID");
    }
    // Fetch existing video
    const video = yield db_1.default.video.findUnique({
        where: { id: videoIdInt },
        select: {
            title: true,
            description: true,
            thumbnail: true
        }
    });
    if (!video)
        throw new ApiError_1.ApiError(404, "Video not found");
    if (!video.thumbnail)
        throw new ApiError_1.ApiError(404, "Video thumbnail not found");
    // Destructure incoming fields
    let { title, description } = req.body;
    let thumbnail = video.thumbnail; // Default to current thumbnail
    // If a new file is uploaded, handle Cloudinary upload
    if (req.file) {
        const newThumbnail = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
        if (!newThumbnail)
            throw new ApiError_1.ApiError(500, "Failed to upload new thumbnail to Cloudinary");
        // Delete old image after successfully uploading the new one
        const oldImageDeleted = yield (0, cloudinary_1.deleteOldImage)(video.thumbnail);
        if (!oldImageDeleted)
            throw new ApiError_1.ApiError(500, "Failed to delete old thumbnail from storage");
        thumbnail = newThumbnail;
    }
    // Use old title/description if new ones are not provided
    if (!title)
        title = video.title;
    if (!description)
        description = video.description;
    // Update video details in database
    const updatedVideo = yield db_1.default.video.update({
        where: { id: videoIdInt },
        data: {
            title: title.toLowerCase(),
            description: description.toLowerCase(),
            thumbnail
        }
    });
    if (!updatedVideo)
        throw new ApiError_1.ApiError(500, "Failed to update video");
    // Return updated video info
    res.status(200).json({ result: updatedVideo });
}));
exports.updateVideo = updateVideo;
const deleteVideo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const video = yield db_1.default.video.findUnique({
            where: {
                id: parseInt(videoId)
            },
            select: {
                videoFile: true,
                thumbnail: true
            }
        });
        if (!video)
            throw new ApiError_1.ApiError(404, "No Video Found");
        const result = yield db_1.default.video.delete({
            where: {
                id: parseInt(videoId)
            }
        });
        if (!result)
            throw new ApiError_1.ApiError(404, "Can't able to delete the video");
        // console.log(video.videoFile)
        const deleteVideo = yield (0, cloudinary_1.deleteOldVideo)(video === null || video === void 0 ? void 0 : video.videoFile);
        const deleteThumbnail = yield (0, cloudinary_1.deleteOldImage)(video === null || video === void 0 ? void 0 : video.thumbnail);
        if (deleteVideo != 'ok' && deleteThumbnail != 'ok')
            throw new ApiError_1.ApiError(404, "Not able to delete the links");
        // console.log(deleteVideo)
        res.json({
            message: "Sucessfully deleted the videos"
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, error.message);
    }
}));
exports.deleteVideo = deleteVideo;
const getAllVideos = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.video.findMany({
            where: {
                isPublished: true
            }
        });
        if (!result)
            throw new ApiError_1.ApiError(400, "No video Found");
        // const username = await prisma.user.findUnique({
        //     where:{
        //         userId: result.userId
        //     }
        // })
        const videoDetails = yield Promise.all(result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const username = yield db_1.default.user.findUnique({
                where: {
                    id: item.userId
                },
                select: {
                    username: true
                }
            });
            return Object.assign(Object.assign({}, item), { username: username === null || username === void 0 ? void 0 : username.username });
        })));
        // console.log(usernameDetails)
        res.status(200).json({
            videoDetails
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, "Can't Able to fetch videos");
    }
}));
exports.getAllVideos = getAllVideos;
const watchHistory = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const result = yield db_1.default.watchHistory.create({
        data: {
            userId: req.userId,
            videoId: parseInt(videoId)
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "Can't able to add this to watch history");
    res.status(200).json({
        message: "Added to watch history"
    });
}));
exports.watchHistory = watchHistory;
const getVideosOfChannel = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield db_1.default.video.findMany({
            where: {
                userId: id,
                isPublished: true
            },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                views: true
            }
        });
        if (!result)
            throw new ApiError_1.ApiError(400, "No video found");
        res.status(200).json({
            result
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, error);
    }
}));
exports.getVideosOfChannel = getVideosOfChannel;
const increaseViewsCount = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const userId = req.userId;
    if (!userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const redisKey = `video:${videoId}:viewers`;
    const isNewView = yield redisClient_1.default.sAdd(redisKey, userId);
    if (isNewView) {
        yield redisClient_1.default.incr(`video:${videoId}:views`);
        const result = yield db_1.default.views.create({
            data: {
                videoId: parseInt(videoId),
                userId: userId
            }
        });
        if (!result)
            throw new ApiError_1.ApiError(500, "Views cannot be able to update");
        const views = yield redisClient_1.default.get(`video:${videoId}:views`);
        res.status(200).json({
            views
        });
    }
    else {
        const views = yield redisClient_1.default.get(`video:${videoId}:views`);
        console.log(views);
        res.status(301).json({
            views
        });
        return;
    }
}));
exports.increaseViewsCount = increaseViewsCount;
