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
exports.getChannelVideos = exports.statsController = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const statsController = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // Access user for total subscribers, tweets, and subscriptions
    // Access video for video views, total videos, total likes.
    const userId = req.userId;
    if (!userId)
        throw new ApiError_1.ApiError(400, "No username found");
    const [subscribers, tweets, subscriptions, videoCount, videoDetails] = yield Promise.all([
        db_1.default.subscription.count({
            where: {
                channelId: userId,
                // subscriberId: userId
            }
        }),
        db_1.default.tweet.count({
            where: {
                userId: userId
            }
        }),
        db_1.default.subscription.count({
            where: {
                subscriberId: userId
            }
        }),
        db_1.default.video.count({
            where: {
                userId: userId
            }
        }),
        db_1.default.video.findMany({
            where: {
                userId: userId
            },
            select: {
                views: true,
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        })
    ]);
    res.json({
        subscribers,
        tweets,
        subscriptions,
        videoCount,
        videoDetails
    });
}));
exports.statsController = statsController;
const getChannelVideos = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Username Not found");
    const result = yield db_1.default.video.findMany({
        where: {
            userId: req.userId
        },
        select: {
            title: true,
            videoFile: true
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "No video found");
    res.status(200).json({
        result
    });
}));
exports.getChannelVideos = getChannelVideos;
