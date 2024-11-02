import { Router } from "express";
import { addComments, deleteComments, getAllComments, updateComments } from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.route('/add/:videoId').post(verifyJWT,addComments)
router.route('/update/:videoId').put(verifyJWT,updateComments)
router.route('/all/:videoId').get(verifyJWT, getAllComments)
router.route('/delete/:videoId').delete(verifyJWT,deleteComments)


export default router