"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/upload-video').post(auth_middleware_1.verifyJWT, multer_middleware_1.videoUpload.fields([
    {
        name: 'video',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), video_controller_1.uploadVideo);
router.route('/toggle-publish-status/:videoId').post(auth_middleware_1.verifyJWT, video_controller_1.togglePublishStatus);
router.route('/get-video/:videoId').get(auth_middleware_1.verifyJWT, video_controller_1.getVideoById);
router.route('/delete-video/:videoId').delete(auth_middleware_1.verifyJWT, video_controller_1.deleteVideo);
router.route('/get-all-videos').get(auth_middleware_1.verifyJWT, video_controller_1.getAllVideos);
router.route('/update-video/:videoId').put(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single('thumbnail'), video_controller_1.updateVideo);
router.route('/watch/:videoId').post(auth_middleware_1.verifyJWT, video_controller_1.watchHistory);
router.route('/:id').get(auth_middleware_1.verifyJWT, video_controller_1.getVideosOfChannel);
router.route('/views/:videoId').post(auth_middleware_1.verifyJWT, video_controller_1.increaseViewsCount);
exports.default = router;
