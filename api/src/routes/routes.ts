import { Hono } from "hono";
import userRouter from '../routes/users.routes'
const route = new Hono()
route.route('/user', userRouter)

export default route