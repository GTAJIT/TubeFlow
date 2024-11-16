"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.route('/add/:videoId').post(auth_middleware_1.verifyJWT, comment_controller_1.addComments);
router.route('/update/:videoId').put(auth_middleware_1.verifyJWT, comment_controller_1.updateComments);
router.route('/all/:videoId').get(auth_middleware_1.verifyJWT, comment_controller_1.getAllComments);
router.route('/delete/:videoId').delete(auth_middleware_1.verifyJWT, comment_controller_1.deleteComments);
exports.default = router;