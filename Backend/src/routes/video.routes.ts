import { Router } from "express";
import { uploadVideo, togglePublishStatus, getVideoById, updateVideo, deleteVideo, getAllVideos, watchHistory, getVideosOfChannel, increaseViewsCount } from "../controllers/video.controller";
import { upload, videoUpload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.route('/upload-video').post(verifyJWT,videoUpload.fields([
    {
        name: 'video',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]),uploadVideo)
router.route('/toggle-publish-status/:videoId').post(verifyJWT, togglePublishStatus)
router.route('/get-video/:videoId').get(verifyJWT,getVideoById)
router.route('/delete-video/:videoId').delete(verifyJWT,deleteVideo)
router.route('/get-all-videos').get(verifyJWT,getAllVideos)
router.route('/update-video/:videoId').put(verifyJWT,upload.single('thumbnail'), updateVideo)
router.route('/watch/:videoId').post(verifyJWT, watchHistory)
router.route('/:id').get(verifyJWT, getVideosOfChannel)
router.route('/views/:videoId').post(verifyJWT, increaseViewsCount)

export default router