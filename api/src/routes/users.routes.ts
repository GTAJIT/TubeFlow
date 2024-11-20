import { Hono } from "hono";
import { registerHandler } from "../controllers/users.controller";
const routes = new Hono()
routes.post('/register', async(c)=>{
    const input: string = await c.req.json()
    const result = registerHandler(input)
    return c.json({
        result
    })
} )

export default routes