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
exports.getSubscribedChannels = exports.toggleSubscription = exports.getUserChannelSubscribers = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const getUserChannelSubscribers = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.params;
    if (!channelId)
        throw new ApiError_1.ApiError(400, "User not found");
    const existingChannel = yield db_1.default.subscription.findMany({
        where: {
            channelId: channelId,
        },
        select: {
            subscriberId: true
        }
    });
    if (!existingChannel)
        throw new ApiError_1.ApiError(400, "User doesn't exist");
    res.send({
        existingChannel
    });
}));
exports.getUserChannelSubscribers = getUserChannelSubscribers;
const toggleSubscription = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.params;
    let isSubscribed = false;
    if (!channelId)
        throw new ApiError_1.ApiError(404, "Channel Not found");
    if (req.userId == channelId) {
        throw new ApiError_1.ApiError(400, "You can't subscribe yourself");
    }
    const existingSubscriber = yield db_1.default.subscription.findFirst({
        where: {
            channelId: channelId,
            subscriberId: req.userId
        }
    });
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "User not found");
    if (existingSubscriber) {
        isSubscribed = false;
        yield db_1.default.subscription.delete({
            where: {
                id: existingSubscriber.id
            }
        });
    }
    else {
        isSubscribed = true;
        yield db_1.default.subscription.create({
            data: {
                channelId: channelId,
                subscriberId: req.userId
            }
        });
    }
    res.json({
        message: isSubscribed ? "Subscribed" : "Unsubscribed"
    });
}));
exports.toggleSubscription = toggleSubscription;
const getSubscribedChannels = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriberId } = req.params;
    console.log(subscriberId);
    if (!subscriberId)
        throw new ApiError_1.ApiError(400, "User not found");
    const existingSubscriber = yield db_1.default.subscription.findMany({
        where: {
            subscriberId: subscriberId,
        },
        select: {
            channelId: true
        }
    });
    if (!existingSubscriber)
        throw new ApiError_1.ApiError(400, "User doesn't exist");
    res.send({
        existingSubscriber
    });
}));
exports.getSubscribedChannels = getSubscribedChannels;
