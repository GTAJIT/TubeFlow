"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/register').post(multer_middleware_1.upload.fields([{
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }]), user_controller_1.registerHandler);
router.route('/login').post(user_controller_1.loginHandler);
router.route('/logout').post(auth_middleware_1.verifyJWT, user_controller_1.logoutHandler);
router.route('/refresh-access-token').post(user_controller_1.refreshAccessToken);
router.route('/update-password').post(auth_middleware_1.verifyJWT, user_controller_1.updatePassword);
router.route('/update-username').post(auth_middleware_1.verifyJWT, user_controller_1.updateUsername);
router.route('/get-current-user').get(auth_middleware_1.verifyJWT, user_controller_1.getCurrentUser);
router.route('/get-user-by-id/:userId').get(auth_middleware_1.verifyJWT, user_controller_1.getUserById);
router.route('/c/:username').get(auth_middleware_1.verifyJWT, user_controller_1.getUserChannelProfile);
router.route('/watch-history').get(auth_middleware_1.verifyJWT, user_controller_1.getWatchHistory);
router.route('/update-avatar').post(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single('avatar'), user_controller_1.updateUserAvatar);
router.route('/update-cover-image').post(auth_middleware_1.verifyJWT, multer_middleware_1.upload.single('coverImage'), user_controller_1.updateUserCoverImage);
router.route('/check').get(auth_middleware_1.verifyJWT, user_controller_1.check);
exports.default = router;
