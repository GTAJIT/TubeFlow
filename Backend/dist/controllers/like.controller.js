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
exports.getLikeById = exports.getLikedVideos = exports.toggleVideoLike = exports.toggleTweetLike = exports.toggleCommentLike = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const toggleVideoLike = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    //TODO: toggle like on video
    let result;
    if (!videoId)
        throw new ApiError_1.ApiError(404, "No video found");
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const existingLike = yield db_1.default.like.findFirst({
        where: {
            AND: {
                videoId: parseInt(videoId),
                userId: req.userId,
            },
        },
    });
    if (existingLike) {
        yield db_1.default.like.delete({
            where: {
                id: existingLike.id,
            },
        });
    }
    else {
        result = yield db_1.default.like.create({
            data: {
                userId: req.userId,
                videoId: parseInt(videoId),
            },
        });
    }
    res.status(200).json({
        message: result ? "Liked" : "UnLiked",
    });
}));
exports.toggleVideoLike = toggleVideoLike;
const toggleCommentLike = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    let result;
    if (!commentId)
        throw new ApiError_1.ApiError(404, "No comment found");
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const existingLike = yield db_1.default.like.findFirst({
        where: {
            AND: {
                commentId: parseInt(commentId),
                userId: req.userId,
            },
        },
    });
    if (existingLike) {
        yield db_1.default.like.delete({
            where: {
                id: existingLike.id,
            },
        });
    }
    else {
        result = yield db_1.default.like.create({
            data: {
                userId: req.userId,
                commentId: parseInt(commentId),
            },
        });
    }
    res.status(200).json({
        message: result ? "Comment Liked" : "Comment UnLiked",
    });
}));
exports.toggleCommentLike = toggleCommentLike;
const toggleTweetLike = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    let result;
    if (!tweetId)
        throw new ApiError_1.ApiError(404, "No tweet found");
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const existingLike = yield db_1.default.like.findFirst({
        where: {
            AND: {
                tweetId: parseInt(tweetId),
                userId: req.userId,
            },
        },
    });
    if (existingLike) {
        yield db_1.default.like.delete({
            where: {
                id: existingLike.id,
            },
        });
    }
    else {
        result = yield db_1.default.like.create({
            data: {
                userId: req.userId,
                tweetId: parseInt(tweetId),
            },
        });
    }
    res.status(200).json({
        message: result ? "Tweet Liked" : "Tweet UnLiked",
    });
}));
exports.toggleTweetLike = toggleTweetLike;
const getLikedVideos = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: get all liked videos
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const result = yield db_1.default.video.findMany({
        where: {
            likes: {
                some: {
                    userId: req.userId
                }
            }
        },
        select: {
            videoFile: true
        }
    });
    res.status(200).json({
        message: result
    });
}));
exports.getLikedVideos = getLikedVideos;
const getLikeById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = parseInt(req.params.videoId);
    const likeCount = yield db_1.default.like.count({
        where: {
            videoId: videoId
        }
    });
    res.json({
        likeCount
    });
}));
exports.getLikeById = getLikeById;
