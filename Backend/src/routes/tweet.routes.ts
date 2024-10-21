import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.route('/create').post(verifyJWT,createTweet)
router.route('/update/:id').put(verifyJWT,updateTweet)
router.route('/delete/:id').delete(verifyJWT,deleteTweet)
router.route('/all').get(verifyJWT,getUserTweets)
export default router