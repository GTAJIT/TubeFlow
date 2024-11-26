import { Router } from "express";
import { check, getCurrentUser, getUserById, getUserChannelProfile, getWatchHistory, loginHandler, logoutHandler, refreshAccessToken, registerHandler, updatePassword, updateUserAvatar, updateUserCoverImage, updateUsername } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.route('/register').post(upload.fields([{
    name: "avatar",
    maxCount:1
},{
    name: "coverImage",
    maxCount: 1
}]),registerHandler)
router.route('/login').post(loginHandler)
router.route('/logout').post(verifyJWT, logoutHandler)
router.route('/refresh-access-token').post(refreshAccessToken)
router.route('/update-password').post(verifyJWT, updatePassword)
router.route('/update-username').post(verifyJWT, updateUsername)
router.route('/get-current-user').get(verifyJWT, getCurrentUser)
router.route('/get-user-by-id/:userId').get(verifyJWT, getUserById)
router.route('/c/:username').get(verifyJWT,getUserChannelProfile)
router.route('/watch-history').get(verifyJWT,getWatchHistory)
router.route('/update-avatar').post(verifyJWT,upload.single('avatar'), updateUserAvatar)
router.route('/update-cover-image').post(verifyJWT,upload.single('coverImage'), updateUserCoverImage)
router.route('/check').get(verifyJWT, check)
export default router