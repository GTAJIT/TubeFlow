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
exports.updatePlaylist = exports.deletePlaylist = exports.removeVideoFromPlaylist = exports.addVideoToPlaylist = exports.getPlaylistById = exports.getUserPlaylists = exports.createPlaylist = void 0;
const db_1 = __importDefault(require("../db/db"));
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const createPlaylist = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const result = yield db_1.default.playlist.create({
        data: {
            name: name,
            description: description,
            userId: req.userId,
        },
    });
    console.log(result);
    if (!result)
        throw new ApiError_1.ApiError(400, "Unable to create playlist");
    res.status(200).json({
        result
    });
}));
exports.createPlaylist = createPlaylist;
const getUserPlaylists = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Get user playlists
    const playlists = yield db_1.default.playlist.findMany({
        where: { userId },
    });
    if (!playlists || playlists.length === 0) {
        return res.status(404).json({ message: "No Playlist Found" });
    }
    // Get the first video in the first playlist (if any)
    const video = yield Promise.all(playlists.map((playlist) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db_1.default.playlistVideo.findFirst({
            where: { playlistId: playlist.id },
            orderBy: { id: 'asc' },
        });
        if (!result)
            return Object.assign(Object.assign({}, playlist), { firstVideo: null });
        const video = yield db_1.default.video.findUnique({
            where: {
                id: result.videoId
            },
            select: {
                thumbnail: true
            }
        });
        return Object.assign(Object.assign({}, playlist), { firstVideo: video === null || video === void 0 ? void 0 : video.thumbnail });
    })));
    console.log(video);
    return res.status(200).json({
        video
    });
}));
exports.getUserPlaylists = getUserPlaylists;
const getPlaylistById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    const result = yield db_1.default.playlist.findMany({
        where: {
            id: parseInt(playlistId),
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(400, "Unable to fetch playlist");
    res.status(200).json({
        result,
    });
}));
exports.getPlaylistById = getPlaylistById;
const addVideoToPlaylist = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId, videoId } = req.params;
    if (!req.userId)
        throw new ApiError_1.ApiError(401, "Unauthorized Access");
    const result = yield db_1.default.playlistVideo.create({
        data: {
            playlistId: parseInt(playlistId),
            videoId: parseInt(videoId),
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(400, "Can't able to add videos");
    res.status(200).json({
        message: "Video Added",
    });
}));
exports.addVideoToPlaylist = addVideoToPlaylist;
const removeVideoFromPlaylist = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    const existingVideos = yield db_1.default.playlistVideo.findMany({
        where: {
            AND: {
                playlistId: parseInt(playlistId),
                videoId: parseInt(videoId),
            },
        },
    });
    const videoDetails = existingVideos.filter((item) => item.videoId == parseInt(videoId));
    const result = yield db_1.default.playlistVideo.delete({
        where: {
            id: videoDetails[0].id,
        },
    });
    res.json(result);
}));
exports.removeVideoFromPlaylist = removeVideoFromPlaylist;
const deletePlaylist = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    // TODO: delete playlist
    const existingPlaylist = yield db_1.default.playlist.findUnique({
        where: {
            id: parseInt(playlistId),
        },
    });
    // const existingPlaylistVideos = await prisma.playlistVideo.findMany({
    //     where:{
    //         playlistId: parseInt(playlistId)
    //     }
    // })
    if (!existingPlaylist)
        throw new ApiError_1.ApiError(404, "No playlist found");
    // if(!existingPlaylistVideos) throw new ApiError(404, "No playlist video found")
    yield db_1.default.playlistVideo.deleteMany({
        where: {
            playlistId: parseInt(playlistId),
        },
    });
    const result = yield db_1.default.playlist.delete({
        where: {
            id: existingPlaylist.id,
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(400, "Cannot able to delete it.");
    res.status(200).json({
        message: "Playlist Deleted",
    });
}));
exports.deletePlaylist = deletePlaylist;
const updatePlaylist = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
    const existingPlaylist = yield db_1.default.playlist.findUnique({
        where: {
            id: parseInt(playlistId),
        },
    });
    if (!existingPlaylist)
        throw new ApiError_1.ApiError(400, "No Playlist Found");
    const result = yield db_1.default.playlist.update({
        where: {
            id: existingPlaylist.id,
        },
        data: {
            name: name,
            description: description,
        },
    });
    if (!result)
        throw new ApiError_1.ApiError(401, "Can't Able to Update");
    res.status(200).json({
        message: "Playlist Update",
    });
}));
exports.updatePlaylist = updatePlaylist;
