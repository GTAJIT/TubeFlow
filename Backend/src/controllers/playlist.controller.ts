import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!req.userId) throw new ApiError(401, "Unauthorized Access");
  const result = await prisma.playlist.create({
    data: {
      name: name,
      description: description,
      userId: req.userId,
    },
  });
  if (!result) throw new ApiError(400, "Unable to create playlist");
  res.status(200).json({
    message: "Playlist Created",
  });
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    // Get user playlists
    const result = await prisma.playlist.findMany({
      where: { userId },
    });
  
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No Playlist Found" });
    }
  
    // Get the first video in the first playlist (if any)
    const video = await prisma.playlistVideo.findFirst({
      where: { playlistId: result[0].id },
    });
  
    if (!video) {
      return res.status(200).json(result);
    }
  
    // Fetch the thumbnail for the first video
    const firstVideo = await prisma.video.findUnique({
      where: { id: video.videoId },
      select: { thumbnail: true },
    });
  
    // Attach the thumbnail to each playlist in the result
    const finalResult = result.map((details) => ({
      ...details,
      firstVideo,
    }));
  
    return res.status(200).json({
        finalResult
    });
  });
  

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const result = await prisma.playlist.findMany({
    where: {
      id: parseInt(playlistId),
    },
  });
  if (!result) throw new ApiError(400, "Unable to fetch playlist");
  res.status(200).json({
    result,
  });
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!req.userId) throw new ApiError(401, "Unauthorized Access");
  const result = await prisma.playlistVideo.create({
    data: {
      playlistId: parseInt(playlistId),
      videoId: parseInt(videoId),
    },
  });

  if (!result) throw new ApiError(400, "Can't able to add videos");

  res.status(200).json({
    message: "Video Added",
  });
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const existingVideos = await prisma.playlistVideo.findMany({
    where: {
      AND: {
        playlistId: parseInt(playlistId),
        videoId: parseInt(videoId),
      },
    },
  });
  const videoDetails = existingVideos.filter(
    (item) => item.videoId == parseInt(videoId)
  );
  const result = await prisma.playlistVideo.delete({
    where: {
      id: videoDetails[0].id,
    },
  });
  res.json(result);
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const existingPlaylist = await prisma.playlist.findUnique({
    where: {
      id: parseInt(playlistId),
    },
  });
  // const existingPlaylistVideos = await prisma.playlistVideo.findMany({
  //     where:{
  //         playlistId: parseInt(playlistId)
  //     }
  // })
  if (!existingPlaylist) throw new ApiError(404, "No playlist found");
  // if(!existingPlaylistVideos) throw new ApiError(404, "No playlist video found")
  await prisma.playlistVideo.deleteMany({
    where: {
      playlistId: parseInt(playlistId),
    },
  });

  const result = await prisma.playlist.delete({
    where: {
      id: existingPlaylist.id,
    },
  });
  if (!result) throw new ApiError(400, "Cannot able to delete it.");
  res.status(200).json({
    message: "Playlist Deleted",
  });
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  const existingPlaylist = await prisma.playlist.findUnique({
    where: {
      id: parseInt(playlistId),
    },
  });
  if (!existingPlaylist) throw new ApiError(400, "No Playlist Found");
  const result = await prisma.playlist.update({
    where: {
      id: existingPlaylist.id,
    },
    data: {
      name: name,
      description: description,
    },
  });
  if (!result) throw new ApiError(401, "Can't Able to Update");
  res.status(200).json({
    message: "Playlist Update",
  });
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
