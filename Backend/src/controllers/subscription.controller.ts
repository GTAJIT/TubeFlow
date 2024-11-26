import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";

const getUserChannelSubscribers = asyncHandler(async(req, res)=>{
    const {channelId} = req.params;
    if(!channelId) throw new ApiError(400, "User not found")
    const existingChannel = await prisma.subscription.findMany({
        where:{
            channelId: channelId,
        },
        select:{
            subscriberId: true
        }
    })
    if(!existingChannel) throw new ApiError(400, "User doesn't exist")
    
    res.send({
        existingChannel 
    })
})
const toggleSubscription = asyncHandler(async(req, res)=>{
    const {channelId} = req.params;
    let isSubscribed = false
    if(!channelId) throw new ApiError(404, "Channel Not found")
    if(req.userId == channelId){
        throw new ApiError(400, "You can't subscribe yourself")
    }
    const existingSubscriber = await prisma.subscription.findFirst({
        where:{
            channelId: channelId,
            subscriberId: req.userId
        }
    })
    if(!req.userId) throw new ApiError(400, "User not found")
        if(existingSubscriber) {
            isSubscribed = false
            await prisma.subscription.delete({
                where:{
                    id: existingSubscriber.id
                }
            })
        } else{
            isSubscribed = true
            await prisma.subscription.create({
                data:{
                    channelId: channelId,
                    subscriberId: req.userId
                }
            })
    }
    res.json({
        message: isSubscribed? "Subscribed": "Unsubscribed"
    })
})

const getSubscribedChannels = asyncHandler(async(req, res)=>{
    const {subscriberId} = req.params;
    console.log(subscriberId)
    if(!subscriberId) throw new ApiError(400, "User not found")
    const existingSubscriber = await prisma.subscription.findMany({
        where:{
            subscriberId: subscriberId,
        },
        select:{
            channelId: true
        }
    })
    if(!existingSubscriber) throw new ApiError(400, "User doesn't exist")
    
    res.send({
        existingSubscriber 
    })
})

export {
    getUserChannelSubscribers,
    toggleSubscription,
    getSubscribedChannels
}