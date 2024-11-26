import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  let result;
  if (!videoId) throw new ApiError(404, "No video found");
  if (!req.userId) throw new ApiError(401, "Unauthorized Access");
  const existingLike = await prisma.like.findFirst({
    where: {
      AND: {
        videoId: parseInt(videoId),
        userId: req.userId,
      },
    },
  });
  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    result = await prisma.like.create({
      data: {
        userId: req.userId,
        videoId: parseInt(videoId),
      },
    });
  }
  res.status(200).json({
    message: result ? "Liked":"UnLiked",
  });
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  //TODO: toggle like on comment
  let result;
  if (!commentId) throw new ApiError(404, "No comment found");
  if (!req.userId) throw new ApiError(401, "Unauthorized Access");
  const existingLike = await prisma.like.findFirst({
    where: {
      AND: {
        commentId: parseInt(commentId),
        userId: req.userId,
      },
    },
  });
  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    result = await prisma.like.create({
      data: {
        userId: req.userId,
        commentId: parseInt(commentId),
      },
    });
  }
  res.status(200).json({
    message: result ? "Comment Liked":"Comment UnLiked",
  });
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  let result;
  if (!tweetId) throw new ApiError(404, "No tweet found");
  if (!req.userId) throw new ApiError(401, "Unauthorized Access");
  const existingLike = await prisma.like.findFirst({
    where: {
      AND: {
        tweetId: parseInt(tweetId),
        userId: req.userId,
      },
    },
  });
  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    result = await prisma.like.create({
      data: {
        userId: req.userId,
        tweetId: parseInt(tweetId),
      },
    });
  }
  res.status(200).json({
    message: result ? "Tweet Liked":"Tweet UnLiked",
  });
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  if(!req.userId) throw new ApiError(401, "Unauthorized Access");
  const result = await prisma.video.findMany({
    where:{
        likes:{
            some:{
                userId: req.userId
            }
        }
    },
    select:{
        videoFile: true
    }
  })

  res.status(200).json({
    message: result
  })
});

const getLikeById = asyncHandler(async(req, res)=>{
  const videoId = parseInt(req.params.videoId)
  const likeCount = await prisma.like.count({
    where:{
      videoId: videoId
    }
  })

  res.json({
    likeCount
  })
})
const getTweetLikeById = asyncHandler(async(req, res)=>{
  const tweetId = parseInt(req.params.tweetId)
  const likeCount = await prisma.like.count({
    where:{
      tweetId: tweetId
    }
  })

  res.json({
    likeCount
  })
})
export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos, getLikeById, getTweetLikeById };
