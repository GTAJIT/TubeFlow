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
exports.getUserById = exports.check = exports.getWatchHistory = exports.getUserChannelProfile = exports.updateUserCoverImage = exports.updateUserAvatar = exports.updateUsername = exports.getCurrentUser = exports.updatePassword = exports.refreshAccessToken = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const db_1 = __importDefault(require("../db/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const cloudinary_1 = require("../utils/cloudinary");
const token_1 = require("../utils/token");
const user_schema_1 = require("../zod_schema/user.schema");
const options = {
    httpOnly: true,
    secure: true,
};
const registerHandler = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.body) {
            res.status(400).json({ message: "Request body is required." });
            return;
        }
        if (!req.files) {
            res.status(400).json({
                message: "No Files Uploaded"
            });
            return;
        }
        const files = req.files;
        console.log(files);
        const avatarPath = (_a = files === null || files === void 0 ? void 0 : files.avatar[0]) === null || _a === void 0 ? void 0 : _a.path;
        const coverImagePath = ((_b = files === null || files === void 0 ? void 0 : files.coverImage[0]) === null || _b === void 0 ? void 0 : _b.path) || "";
        const { success, data } = user_schema_1.registrationSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({
                success,
                message: "Invalid Email Address"
            });
            return;
        }
        const existingUser = yield db_1.default.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email },
                ]
            },
        });
        if (existingUser) {
            throw new ApiError_1.ApiError(409, "User already exists");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
        const avatar = yield (0, cloudinary_1.uploadOnCloudinary)(avatarPath);
        // console.log(avatar);
        if (!avatar) {
            throw new ApiError_1.ApiError(409, "Avatar not found");
        }
        const coverImage = yield (0, cloudinary_1.uploadOnCloudinary)(coverImagePath);
        const result = yield db_1.default.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                avatar: avatar,
                coverImage: coverImage || "",
                fullName: data.fullName,
                refreshToken: "",
            },
        });
        if (result) {
            res.json({
                message: "User Created Successfully",
                result,
            });
        }
    }
    catch (error) {
        console.log(error);
        if (error instanceof ApiError_1.ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        }
        else {
            res.status(500).json({ success: false, message: "An Error had occurred during registration" });
        }
    }
}));
exports.registerHandler = registerHandler;
const loginHandler = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = user_schema_1.loginSchema.safeParse(req.body);
    // console.log(data);
    if (!success) {
        throw new ApiError_1.ApiError(400, "Bad Request - Invalid Input");
    }
    const { username, password, email } = data;
    const user = yield db_1.default.user.findUnique({
        where: {
            username,
            email,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, "Invalid Password");
    }
    const { accessToken, refreshToken } = yield (0, token_1.generateAccessAndRefreshToken)(user.id);
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
        message: "Successfully Logged In",
        user,
        accessToken,
        refreshToken,
    });
}));
exports.loginHandler = loginHandler;
const logoutHandler = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield db_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, refreshToken: true },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    // 2. Clear the refresh token only if it exists (optimization)
    if (user.refreshToken) {
        yield db_1.default.user.update({
            where: { id: userId },
            data: {
                refreshToken: "", // Remove the refresh token
            },
        });
    }
    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
        message: "Successfully Logged out",
    });
}));
exports.logoutHandler = logoutHandler;
const refreshAccessToken = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log(incomingRefreshToken);
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    console.log(refreshTokenSecret);
    if (!refreshTokenSecret) {
        return;
    }
    if (!incomingRefreshToken) {
        throw new ApiError_1.ApiError(401, "Bad Request");
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, refreshTokenSecret);
        if (!decodedToken) {
            throw new ApiError_1.ApiError(401, "Invalid Refresh Token");
        }
        const user = yield db_1.default.user.findUnique({
            where: { id: decodedToken.userId },
            select: { id: true, refreshToken: true },
        });
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError_1.ApiError(401, "Refresh Token expired");
        }
        const { accessToken, refreshToken } = yield (0, token_1.generateAccessAndRefreshToken)(user.id);
        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            message: "Access token refreshed",
        });
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, error);
    }
}));
exports.refreshAccessToken = refreshAccessToken;
const updatePassword = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = user_schema_1.passwordSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError_1.ApiError(401, "Wrong Input");
    }
    const { oldPassword, newPassword } = data;
    const userId = req.userId;
    const userDetails = yield db_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            password: true,
        },
    });
    const retrivedPassword = userDetails === null || userDetails === void 0 ? void 0 : userDetails.password;
    if (!retrivedPassword)
        return;
    const isPasswordValid = yield bcryptjs_1.default.compare(oldPassword, retrivedPassword);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(400, "Unauthorized");
    }
    const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    const result = yield db_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedNewPassword,
        },
    });
    if (!result)
        return "Something Went wrong";
    res.status(200).json({
        message: "Password Updated Successfully",
    });
}));
exports.updatePassword = updatePassword;
const getCurrentUser = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const result = yield db_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "Not Found");
    res.status(200).json({
        user: result,
    });
}));
exports.getCurrentUser = getCurrentUser;
const getUserById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId.toString();
    console.log(userId);
    const result = yield db_1.default.user.findUnique({
        where: {
            id: userId
        },
        select: {
            avatar: true,
            fullName: true,
            username: true
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(404, "No Channel is found");
    res.status(200).json({
        result,
    });
}));
exports.getUserById = getUserById;
const updateUsername = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, data } = user_schema_1.updateUsernameSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError_1.ApiError(400, "Bad Request");
    }
    const userId = req.userId;
    const result = yield db_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            username: data === null || data === void 0 ? void 0 : data.username,
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(401, "Unauthorized");
    res.json({
        message: "Username Updated Sucessfully",
    });
}));
exports.updateUsername = updateUsername;
const updateUserAvatar = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // console.log(file)
    const avatarPath = file === null || file === void 0 ? void 0 : file.path;
    if (!avatarPath)
        throw new ApiError_1.ApiError(404, "File Not Found");
    const result = yield (0, cloudinary_1.uploadOnCloudinary)(avatarPath);
    if (!result)
        return "Something Went Wrong";
    const previousAvatar = yield db_1.default.user.findUnique({
        where: {
            id: req.userId,
        },
        select: {
            avatar: true,
        },
    });
    if (!previousAvatar)
        return;
    const isImageDeleted = yield (0, cloudinary_1.deleteOldImage)(previousAvatar.avatar);
    // console.log(isImageDeleted)
    if (isImageDeleted.result != "ok")
        throw new ApiError_1.ApiError(400, "Previous Image cannot be deleted");
    const databaseUpdate = yield db_1.default.user.update({
        where: {
            id: req.userId,
        },
        data: {
            avatar: result,
        },
    });
    if (!databaseUpdate)
        throw new ApiError_1.ApiError(404, "Upload Database Failed");
    res.json({
        message: "Avatar Updated",
    });
}));
exports.updateUserAvatar = updateUserAvatar;
const updateUserCoverImage = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // console.log(file)
    const coverImagePath = file === null || file === void 0 ? void 0 : file.path;
    if (!coverImagePath)
        throw new ApiError_1.ApiError(404, "File Not Found");
    const result = yield (0, cloudinary_1.uploadOnCloudinary)(coverImagePath);
    if (!result)
        return "Something Went Wrong";
    const databaseUpdate = yield db_1.default.user.update({
        where: {
            id: req.userId,
        },
        data: {
            coverImage: result,
        },
    });
    if (!databaseUpdate)
        throw new ApiError_1.ApiError(404, "Upload Database Failed");
    res.json({
        message: "Cover Image Updated",
    });
}));
exports.updateUserCoverImage = updateUserCoverImage;
const getUserChannelProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const userDetails = yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user)
            throw new ApiError_1.ApiError(400, "Bad request");
        const subscriberCount = yield prisma.subscription.count({
            where: {
                channelId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        const subcscribedChannelCount = yield prisma.subscription.count({
            where: {
                subscriberId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        // const subcscribedChannelCount = subcscribedChannel.length;
        return {
            subscribers: subscriberCount,
            subscribedChannels: subcscribedChannelCount,
            user,
        };
    }));
    const { user, subscribedChannels, subscribers } = userDetails;
    res.status(200).json({
        id: user.id,
        subscribers: subscribers,
        subscribed: subscribedChannels,
        username: user.username,
        avatar: user.avatar,
        coverImage: user.coverImage,
        fullName: user.fullName,
    });
}));
exports.getUserChannelProfile = getUserChannelProfile;
const getWatchHistory = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming the logged-in user's ID is available as `req.user.userId`
    // Fetch the user's watch history with the video details and the video owner's details
    const userWatchHistory = yield db_1.default.user.findUnique({
        where: { id: userId },
        select: {
            watchHistory: true,
        },
    });
    if (!userWatchHistory) {
        throw new ApiError_1.ApiError(404, "User not found or watch history empty");
    }
    res.status(200).json({
        statusCode: 200,
        data: userWatchHistory.watchHistory,
        message: "Watch history fetched successfully",
    });
}));
exports.getWatchHistory = getWatchHistory;
const check = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "Authorized",
    });
}));
exports.check = check;
