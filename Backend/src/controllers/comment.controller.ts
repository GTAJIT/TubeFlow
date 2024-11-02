import prisma from "../db/db";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import getUsernameById from "../utils/getUserById";
import { getUserById } from "./user.controller";


const addComments = asyncHandler(async(req, res)=>{
    const {comment} = req.body;
    const {videoId} = req.params
    if(!videoId) throw new ApiError(400, "No video found")
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const result = await prisma.comment.create({
        data:{
            videoId: parseInt(videoId),
            userId:req.userId,
            content: comment
        }
    })
    if(!result) throw new ApiError(401, "Can't able to post it")
    
    const userDetails = await prisma.user.findUnique({
        where:{
            id: result.userId
        },
        select:{
            username: true,
            avatar: true
        }
    }) 
    res.json({
        ...result,
        userDetails
    })
})

const getAllComments = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId) throw new ApiError(400, "No video Id found")
    const comments = await prisma.comment.findMany({
        where:{
            videoId: parseInt(videoId)
        },
        //@ts-ignore
        take: parseInt(limit)
    })
    if(!comments) throw new ApiError(400, "No comments found")
    const commentDetails = await Promise.all(
    comments.map(async(item)=>{
        const username = await prisma.user.findUnique({
            where:{
                id: req.userId
            },
            select:{
                username: true,
                avatar: true
            }
        })
        return {
            ...item,
            username
        }
    })
    )
    console.log(commentDetails)
    
    res.json({
        // commentDetails
        commentDetails,
    })
})
const updateComments = asyncHandler(async(req, res)=>{
    const {comment} = req.body;
    const {videoId} = req.params;
    const {commentId} = req.body;
    if(!videoId) throw new ApiError(400, "No video found")
    if(!commentId) throw new ApiError(400, "No comment found")
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const existingComment = await prisma.comment.findFirst({
        where:{
            userId: req.userId
        }
    })
    if(!existingComment) throw new ApiError(404, "Comment not found")
    const existingCommentDetails = await prisma.comment.findMany({
        where:{
            AND:{
                userId: req.userId,
                videoId: parseInt(videoId)
            }
        }
    })
    // if(!existingComment) throw new ApiError(404, "Comment not found")
    
    // console.log(existingCommentDetails)
    const result = await prisma.comment.update({
        where:{
            id: existingCommentDetails.filter((item)=> item.id == parseInt(commentId))[0].id
        },
        data:{
            content: comment
        }
    })
    if(!result) throw new ApiError(401, "Can't able to post it")
    res.json({
        message: "Comment updated"
    })
})
const deleteComments = asyncHandler(async(req, res)=>{
    const {videoId} = req.params;
    const {commentId} = req.query as {commentId: string};
    if(!videoId) throw new ApiError(400, "No video found")
    if(!commentId) throw new ApiError(400, "No comment found")
    if(!req.userId) throw new ApiError(400, "Unauthorized Access")
    const existingComment = await prisma.comment.findFirst({
        where:{
            userId: req.userId
        }
    })
    if(!existingComment) throw new ApiError(404, "Comment not found")
    const existingCommentDetails = await prisma.comment.findMany({
        where:{
            AND:{
                userId: req.userId,
                videoId: parseInt(videoId)
            }
        }
    })
    // if(!existingComment) throw new ApiError(404, "Comment not found")
    
    // console.log(existingCommentDetails)
    const result = await prisma.comment.delete({
        where:{
            id: existingCommentDetails.filter((item)=> item.id == parseInt(commentId))[0].id
        }
    })
    if(!result) throw new ApiError(401, "Can't able to delete it")
    res.json({
        message: "Comment Deleted"
    })
})


export {
    addComments,
    getAllComments,
    updateComments,
    deleteComments
}