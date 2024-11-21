import { Hono } from "hono";
import { registerHandler } from "../controllers/user.controller";
const routes = new Hono()

routes.post("/register", async (c)=>{
    const result = await registerHandler(c)
    return c.json(result.message, result)
})


export default routes