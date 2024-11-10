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
exports.deleteComments = exports.updateComments = exports.getAllComments = exports.addComments = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const addComments = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment } = req.body;
    const { videoId } = req.params;
    if (!videoId)
        throw new ApiError_1.ApiError(400, "No video found");
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const result = yield db_1.default.comment.create({
        data: {
            videoId: parseInt(videoId),
            userId: req.userId,
            content: comment
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(401, "Can't able to post it");
    const userDetails = yield db_1.default.user.findUnique({
        where: {
            id: result.userId
        },
        select: {
            username: true,
            avatar: true
        }
    });
    res.json(Object.assign(Object.assign({}, result), { userDetails }));
}));
exports.addComments = addComments;
const getAllComments = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!videoId)
        throw new ApiError_1.ApiError(400, "No video Id found");
    const comments = yield db_1.default.comment.findMany({
        where: {
            videoId: parseInt(videoId)
        },
        //@ts-ignore
        take: parseInt(limit)
    });
    if (!comments)
        throw new ApiError_1.ApiError(400, "No comments found");
    const commentDetails = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
        const username = yield db_1.default.user.findUnique({
            where: {
                id: comment.userId
            },
            select: {
                username: true,
                avatar: true
            }
        });
        const likes = yield db_1.default.like.count({
            where: {
                commentId: comment.id
            }
        });
        return Object.assign(Object.assign({}, comment), { likes,
            username });
    })));
    console.log(commentDetails);
    res.json({
        // commentDetails
        commentDetails,
    });
}));
exports.getAllComments = getAllComments;
const updateComments = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment } = req.body;
    const { videoId } = req.params;
    const { commentId } = req.body;
    if (!videoId)
        throw new ApiError_1.ApiError(400, "No video found");
    if (!commentId)
        throw new ApiError_1.ApiError(400, "No comment found");
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const existingComment = yield db_1.default.comment.findFirst({
        where: {
            userId: req.userId
        }
    });
    if (!existingComment)
        throw new ApiError_1.ApiError(404, "Comment not found");
    const existingCommentDetails = yield db_1.default.comment.findMany({
        where: {
            AND: {
                userId: req.userId,
                videoId: parseInt(videoId)
            }
        }
    });
    // if(!existingComment) throw new ApiError(404, "Comment not found")
    // console.log(existingCommentDetails)
    const result = yield db_1.default.comment.update({
        where: {
            id: existingCommentDetails.filter((item) => item.id == parseInt(commentId))[0].id
        },
        data: {
            content: comment
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(401, "Can't able to post it");
    res.json({
        message: "Comment updated"
    });
}));
exports.updateComments = updateComments;
const deleteComments = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const { commentId } = req.query;
    if (!videoId)
        throw new ApiError_1.ApiError(400, "No video found");
    if (!commentId)
        throw new ApiError_1.ApiError(400, "No comment found");
    if (!req.userId)
        throw new ApiError_1.ApiError(400, "Unauthorized Access");
    const existingComment = yield db_1.default.comment.findFirst({
        where: {
            userId: req.userId
        }
    });
    if (!existingComment)
        throw new ApiError_1.ApiError(404, "Comment not found");
    const existingCommentDetails = yield db_1.default.comment.findMany({
        where: {
            AND: {
                userId: req.userId,
                videoId: parseInt(videoId)
            }
        }
    });
    // if(!existingComment) throw new ApiError(404, "Comment not found")
    // console.log(existingCommentDetails)
    const result = yield db_1.default.comment.delete({
        where: {
            id: existingCommentDetails.filter((item) => item.id == parseInt(commentId))[0].id
        }
    });
    if (!result)
        throw new ApiError_1.ApiError(401, "Can't able to delete it");
    res.json({
        message: "Comment Deleted"
    });
}));
exports.deleteComments = deleteComments;
