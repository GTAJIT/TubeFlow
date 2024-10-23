import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!req.userId) throw new ApiError(401, "Unauthorized Access")
    const result = await prisma.playlist.create({
        data:{
            name: name,
            description: description,
            userId: req.userId
        }
    })
    if(!result) throw new ApiError(400, "Unable to create playlist")
    res.status(200).json({
        message: "Playlist Created"
    })
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const result = await prisma.playlist.findMany({
        where:{
            userId: userId
        }
    })

    if(!result) res.status(201).json({
        message: "No Playlist Found"
    })

    res.status(200).json({
        result
    })
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const result = await prisma.playlist.findMany({
        where:{
            id: parseInt(playlistId)
        }
    })
    if(!result) throw new ApiError(400, "Unable to fetch playlist")
    res.status(200).json({
        result
    })
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!req.userId) throw new ApiError(401, "Unauthorized Access")
    const result = await prisma.playlistVideo.create({
        data:{
            playlistId: parseInt(playlistId),
            videoId: parseInt(videoId)
        }
    })

    if(!result) throw new ApiError(400, "Can't able to add videos")

    res.status(200).json({
        message: "Video Added"
    })
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const existingVideos = await prisma.playlistVideo.findMany({
        where:{
            AND:{
                playlistId: parseInt(playlistId),
                videoId:parseInt(videoId)
            }
        }
    })
    const videoDetails = existingVideos.filter((item)=> item.videoId == parseInt(videoId))
    const result = await prisma.playlistVideo.delete({
        where:{
            id: videoDetails[0].id
        },
    })
    res.json(result)
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}