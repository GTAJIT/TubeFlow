import { Router } from "express";
import { getChannelVideos, statsController } from "../controllers/dashboard.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getAllVideos } from "../controllers/video.controller";
const router = Router()

router.use(verifyJWT)
router.route("/stats").get(statsController)
router.route("/videos").get(getChannelVideos)



export default router