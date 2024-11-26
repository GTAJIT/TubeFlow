import { Hono } from "hono";
import userRouter from './user.routes'
const routes = new Hono()

routes.route('/user', userRouter)

export default routes