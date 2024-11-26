import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const statsController = asyncHandler(async(req, res)=>{
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // Access user for total subscribers, tweets, and subscriptions
    // Access video for video views, total videos, total likes.
    const userId= req.userId;
    if(!userId) throw new ApiError(400, "No username found")
    const [subscribers, tweets, subscriptions, videoCount, videoDetails] = await Promise.all([
        prisma.subscription.count({
            where:{
                channelId: userId,
                // subscriberId: userId
            }
        }),
        prisma.tweet.count({
            where:{
                userId: userId
            }
        }),
        prisma.subscription.count({
            where:{
                subscriberId: userId
            }
        }),
        prisma.video.count({
            where:{
                userId: userId
            }
        }),
        prisma.video.findMany({
            where:{
                userId: userId
            },
            select:{
                views: true,
                _count:{
                    select:{
                        likes: true
                    }
                }
            }
        })
    ])

    res.json({
        subscribers,
        tweets,
        subscriptions,
        videoCount,
        videoDetails
    })
})
const getChannelVideos = asyncHandler(async(req, res)=>{
    if(!req.userId) throw new ApiError(400, "Username Not found")
    const result = await prisma.video.findMany({
        where:{
            userId: req.userId
        },
        select:{
            title: true,
            videoFile:true
        }
    })
    if(!result) throw new ApiError(404, "No video found")
    res.status(200).json({
        result
    })
})
export {
    statsController,
    getChannelVideos 
}