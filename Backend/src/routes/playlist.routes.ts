import { Router } from "express";
import { createPlaylist, getPlaylistById, updatePlaylist, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getUserPlaylists } from "../controllers/playlist.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.use(verifyJWT)
router.route('/').post(createPlaylist)
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);



export default router