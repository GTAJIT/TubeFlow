import { Hono } from 'hono'
import appRoute from './routes/routes'
const app = new Hono()

app.get("/", (c)=>{
    return c.json({
        message: "Running"
    })
})
app.route('/api/v1', appRoute)

export default app
