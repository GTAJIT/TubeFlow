import prisma from "../db/db";
import { deleteFilePath } from "../middlewares/multer.middleware";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { deleteOldImage, deleteOldVideo, uploadOnCloudinary } from "../utils/cloudinary";
import getVideoDuration from "get-video-duration";
import client from "../utils/redisClient";
const uploadVideo = asyncHandler(async(req, res)=>{
    try {
        const userId = req.userId
        if(!userId){
            throw new ApiError(401, "Unauthorized Access")
        }
        const { title, description } = req.body;
        console.log(req.files)
        const {video, thumbnail} = req.files as {[fieldName: string]: Express.Multer.File[]}
        const videoUpload = await uploadOnCloudinary(video[0].path)  
        if(!videoUpload) throw new ApiError(404, "Video cannot be uploaded")
        const thumbnailUpload = await uploadOnCloudinary(thumbnail[0].path)
        if(!thumbnailUpload) throw new ApiError(404, "Thumbnail cannot be uploaded");
        const duration = await getVideoDuration(videoUpload)
        if(!duration) throw new ApiError(404, "Duration error")
        
        const result = await prisma.video.create({
            data:{
                    videoFile: videoUpload,
                    thumbnail: thumbnailUpload,
                    userId: userId,
                    title: title.toLowerCase(),
                    description: description.toLowerCase(),
                    isPublished: false,
                    duration: duration,
            }
        })
        if(!result) throw new ApiError(404, "Upload Unsuccessful");
        deleteFilePath(video[0].path)
        deleteFilePath(thumbnail[0].path)
        res.json({
            message: result
        })
    } catch (error) {
        console.log(error)
        //@ts-ignore
        throw new ApiError(404, error)
    }
})

const togglePublishStatus = asyncHandler(async(req , res)=>{
    const userId = req.userId
    const {videoId} = req.params
    
    if(!userId) throw new ApiError(401, "Unauthorized")
    if(!videoId) throw new ApiError(403, "Forbidden")
    // if(!id) throw new ApiError(403, "Forbidden")    
    const status = await prisma.video.findMany({
        where:{
            id: parseInt(videoId),
        },
        select:{
            isPublished: true
        }
    }) 
    
    const toggle = await prisma.video.update({
        where:{
            id: parseInt(videoId)
        },
        data:{
            isPublished: !status[0].isPublished
        }
    })
    res.json({
        message: toggle
    })
})  

const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params;
    const result = await prisma.video.findUnique({
        where:{
            id: parseInt(videoId)
        },
    })

    if(!result) throw new ApiError(404, "Video Not Found")

    res.status(200).json({
        result
    })
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    // Parse videoId as integer safely
    const videoIdInt = parseInt(videoId, 10);
    if (isNaN(videoIdInt)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Fetch existing video
    const video = await prisma.video.findUnique({
        where: { id: videoIdInt },
        select: {
            title: true,
            description: true,
            thumbnail: true
        }
    });

    if (!video) throw new ApiError(404, "Video not found");
    if (!video.thumbnail) throw new ApiError(404, "Video thumbnail not found");

    // Destructure incoming fields
    let { title, description } = req.body;
    let thumbnail = video.thumbnail; // Default to current thumbnail

    // If a new file is uploaded, handle Cloudinary upload
    if (req.file) {
        const newThumbnail = await uploadOnCloudinary(req.file.path);
        if (!newThumbnail) throw new ApiError(500, "Failed to upload new thumbnail to Cloudinary");
        
        // Delete old image after successfully uploading the new one
        const oldImageDeleted = await deleteOldImage(video.thumbnail);
        if (!oldImageDeleted) throw new ApiError(500, "Failed to delete old thumbnail from storage");

        thumbnail = newThumbnail;
    }

    // Use old title/description if new ones are not provided
    if (!title) title = video.title;
    if (!description) description = video.description;

    // Update video details in database
    const updatedVideo = await prisma.video.update({
        where: { id: videoIdInt },
        data: {
            title: title.toLowerCase(),
            description:description.toLowerCase(),
            thumbnail
        }
    });

    if (!updatedVideo) throw new ApiError(500, "Failed to update video");

    // Return updated video info
    res.status(200).json({ result: updatedVideo });
});

const deleteVideo = asyncHandler(async(req, res)=>{
    try {
        const {videoId} = req.params
        const video = await prisma.video.findUnique({
            where:{
                id: parseInt(videoId)
            },
            select:{
                videoFile: true,
                thumbnail: true
            }
        })
        if(!video) throw new ApiError(404, "No Video Found")
        const result = await prisma.video.delete({
            where:{
                id: parseInt(videoId)
            }
        })
        if(!result) throw new ApiError(404, "Can't able to delete the video") 
        // console.log(video.videoFile)
        const deleteVideo = await deleteOldVideo(video?.videoFile)
        const deleteThumbnail = await deleteOldImage(video?.thumbnail)
        if(deleteVideo != 'ok' && deleteThumbnail!='ok') throw new ApiError(404, "Not able to delete the links")
        // console.log(deleteVideo)
        res.json({
            message: "Sucessfully deleted the videos"
        })
    } catch (error: any) {
        throw new ApiError(400, error.message)
    }
})

const getAllVideos = asyncHandler(async(req, res) => {
    try {
        const result = await prisma.video.findMany({
            where:{
                isPublished: true
            }
        })

        if(!result) throw new ApiError(400, "No video Found")
        // const username = await prisma.user.findUnique({
        //     where:{
        //         userId: result.userId
        //     }
        // })
        const videoDetails = await Promise.all(result.map(async (item)=>{
            const username = await prisma.user.findUnique({
                where:{
                    id: item.userId
                },
                select:{
                    username: true
                }
            })

            return {...item, username: username?.username}
        }))

        // console.log(usernameDetails)
        res.status(200).json({
            videoDetails
        })
    } catch (error) {
        throw new ApiError(400, "Can't Able to fetch videos")
    }
});

const watchHistory = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const result = await prisma.watchHistory.create({
            data:{
                userId:req.userId,
                videoId: parseInt(videoId)
            }
    })

    if(!result) throw new ApiError(404, "Can't able to add this to watch history")
    res.status(200).json({
        message: "Added to watch history"
    })
})

const getVideosOfChannel = asyncHandler(async(req, res)=>{
    try {
        const {id} = req.params;
        const result = await prisma.video.findMany({
            where:{
                userId: id,
                isPublished: true
            },
            select:{
                id: true,
                title: true,
                thumbnail: true,
                views: true
            }
        })
        if(!result) throw new ApiError(400, "No video found")

        res.status(200).json({
            result
        })
    
    } catch (error: any) {
        throw new ApiError(400, error)
    }
    
})

const increaseViewsCount = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const userId = req.userId;
    if(!userId) throw new ApiError(400, "Unauthorized Access")
    const redisKey = `video:${videoId}:viewers`;
    const isNewView = await client.sAdd(redisKey, userId);
    if(isNewView){
        await client.incr(`video:${videoId}:views`)
        const result = await prisma.views.create({
            data:{
                videoId: parseInt(videoId),
                userId: userId
            }
        })
        if(!result) throw new ApiError(500, "Views cannot be able to update")
        const views = await client.get(`video:${videoId}:views`)
        res.status(200).json({
            views
        })
    } else{
        const views = await client.get(`video:${videoId}:views`)
        console.log(views)
        res.status(301).json({
            views
        })
        return;
    }
})


export {
    uploadVideo,
    togglePublishStatus,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllVideos,
    watchHistory,
    getVideosOfChannel,
    increaseViewsCount,
}