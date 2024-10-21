import { Router } from "express";
import { getUserChannelSubscribers, toggleSubscription, getSubscribedChannels } from "../controllers/subscription.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router.route('/get-subscribers/:channelId').get(verifyJWT,getUserChannelSubscribers)
router.route('/toggle-subscription/:channelId').post(verifyJWT,toggleSubscription)
router.route('/get-subscribed-channels/:subscriberId').post(verifyJWT,getSubscribedChannels)


export default router