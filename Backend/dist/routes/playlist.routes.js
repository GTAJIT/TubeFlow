"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlist_controller_1 = require("../controllers/playlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyJWT);
router.route('/').post(playlist_controller_1.createPlaylist);
router
    .route("/:playlistId")
    .get(playlist_controller_1.getPlaylistById)
    .patch(playlist_controller_1.updatePlaylist)
    .delete(playlist_controller_1.deletePlaylist);
router.route("/add/:videoId/:playlistId").patch(playlist_controller_1.addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(playlist_controller_1.removeVideoFromPlaylist);
router.route("/user/:userId").get(playlist_controller_1.getUserPlaylists);
exports.default = router;
