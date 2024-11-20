import { Hono } from "hono";
import { registerHandler } from "../controllers/user.controller";
const routes = new Hono()

routes.post("/register", async (c)=>{
    const body = await c.req.json()
    const result = registerHandler(body)
    return c.json({
        message: body
    })
})


export default routes