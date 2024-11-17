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
exports.getChannelTweets = exports.deleteTweet = exports.updateTweet = exports.getUserTweets = exports.createTweet = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const createTweet = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweet } = req.body;
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    if (!tweet)
        throw new ApiError_1.ApiError(404, "Can't find any tweet");
    const result = yield db_1.default.tweet.create({
        data: {
            content: tweet,
            userId: req.userId
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "Error creating tweet");
    console.log(result);
    res.status(200).json({
        result
    });
}));
exports.createTweet = createTweet;
const getUserTweets = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const tweet = yield db_1.default.tweet.findMany({
        where: {
            userId: req.userId
        },
    });
    if (!tweet)
        throw new ApiError_1.ApiError(400, "No tweets found");
    const userDetails = yield db_1.default.user.findUnique({
        where: {
            id: req.userId
        },
        select: {
            avatar: true,
            username: true
        }
    });
    const result = yield Promise.all(tweet.map((item) => (Object.assign(Object.assign({}, item), { avatar: userDetails === null || userDetails === void 0 ? void 0 : userDetails.avatar, username: userDetails === null || userDetails === void 0 ? void 0 : userDetails.username }))));
    res.status(200).json({
        result
    });
}));
exports.getUserTweets = getUserTweets;
const getChannelTweets = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const channelId = req.params.channelId;
    // console.log(channelId)
    if (!channelId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const tweet = yield db_1.default.tweet.findMany({
        where: {
            userId: channelId
        },
    });
    if (!tweet)
        throw new ApiError_1.ApiError(400, "No tweets found");
    const userDetails = yield db_1.default.user.findUnique({
        where: {
            id: channelId
        },
        select: {
            avatar: true,
            username: true
        }
    });
    const result = yield Promise.all(tweet.map((item) => (Object.assign(Object.assign({}, item), { avatar: userDetails === null || userDetails === void 0 ? void 0 : userDetails.avatar, username: userDetails === null || userDetails === void 0 ? void 0 : userDetails.username }))));
    res.status(200).json({
        result
    });
}));
exports.getChannelTweets = getChannelTweets;
const updateTweet = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweet } = req.body;
    const { id } = req.params;
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    if (!tweet)
        throw new ApiError_1.ApiError(404, "Can't find any tweet");
    const existingTweet = yield db_1.default.tweet.findMany({
        where: {
            userId: req.userId
        }
    });
    console.log(existingTweet);
    const result = yield db_1.default.tweet.update({
        where: {
            userId: req.userId,
            id: existingTweet[parseInt(id) - 1].id
        },
        data: {
            content: tweet
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "Error creating tweet");
    res.status(200).json({
        message: "Tweet Updated"
    });
}));
exports.updateTweet = updateTweet;
const deleteTweet = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const existingTweet = yield db_1.default.tweet.findMany({
        where: {
            userId: req.userId
        }
    });
    if (!existingTweet)
        throw new ApiError_1.ApiError(404, "No Tweet Found");
    const deleteResult = yield db_1.default.tweet.delete({
        where: {
            id: existingTweet[parseInt(id) - 1].id
        }
    });
    if (!deleteResult)
        throw new ApiError_1.ApiError(404, "Cannot able to delete");
    res.status(200).json({
        message: "Message Deleted"
    });
}));
exports.deleteTweet = deleteTweet;
