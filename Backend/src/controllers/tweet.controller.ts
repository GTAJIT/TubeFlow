import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const createTweet = asyncHandler(async(req, res)=>{
    const {tweet} = req.body;
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    if(!tweet) throw new ApiError(404, "Can't find any tweet");
    const result = await prisma.tweet.create({
        data:{
            content: tweet,
            userId: req.userId
        }
    })
    if(!result) throw new ApiError(404, "Error creating tweet")
        console.log(result)
    res.status(200).json({
        result
    })
})

const getUserTweets = asyncHandler(async(req, res)=>{
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const tweet = await prisma.tweet.findMany({
        where:{
            userId: req.userId
        },
    })
    if(!tweet) throw new ApiError(400, "No tweets found")
    const userDetails = await prisma.user.findUnique({
        where:{
            id: req.userId
        },
        select:{
            avatar: true,
            username: true
        }
    })
    const result = await Promise.all(
        tweet.map((item)=>({
            ...item,
            avatar: userDetails?.avatar,
            username: userDetails?.username
        }))
    )
    
    res.status(200).json({
        result
    })
})

const getChannelTweets = asyncHandler(async(req, res)=>{
    const channelId = req.params.channelId
    // console.log(channelId)
    if(!channelId) throw new ApiError(400, "Unauthorized Access")
    const tweet = await prisma.tweet.findMany({
        where:{
            userId: channelId
        },
    })
    if(!tweet) throw new ApiError(400, "No tweets found")
    const userDetails = await prisma.user.findUnique({
        where:{
            id: channelId
        },
        select:{
            avatar: true,
            username: true
        }
    })
    const result = await Promise.all(
        tweet.map((item)=>({
            ...item,
            avatar: userDetails?.avatar,
            username: userDetails?.username
        }))
    )
    
    res.status(200).json({
        result
    })
})

const updateTweet = asyncHandler(async(req, res)=>{
    const {tweet} = req.body;
    const {id} = req.params
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    if(!tweet) throw new ApiError(404, "Can't find any tweet");
    const existingTweet = await prisma.tweet.findMany({
        where:{
            userId: req.userId
        }
    })
    console.log(existingTweet)
    const result = await prisma.tweet.update({
        where:{
            userId: req.userId,
            id: existingTweet[parseInt(id)-1].id
        },
        data:{
            content: tweet
        }
    })
    if(!result) throw new ApiError(404, "Error creating tweet")
    res.status(200).json({
        message: "Tweet Updated"
    })
})

const deleteTweet = asyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const existingTweet = await prisma.tweet.findMany({
        where:{
            userId: req.userId
        }
    })
    if(!existingTweet) throw new ApiError(404, "No Tweet Found");
    const deleteResult = await prisma.tweet.delete({
        where:{
            id:existingTweet[parseInt(id)-1].id
        }
    })
    if(!deleteResult) throw new ApiError(404, "Cannot able to delete");
    res.status(200).json({
        message: "Message Deleted"
    })
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getChannelTweets
}