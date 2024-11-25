import { Hono } from 'hono'
import appRouter from './routes/index.routes'
const app = new Hono()
import { v2 as cloudinary } from "cloudinary";
import { config } from 'dotenv';
import { Context } from 'hono';
config({path: '../.env'})
app.use(async(c:Context, next)=>{
    cloudinary.config({
        cloud_name: c.env.CLOUDINARY_CLOUD_NAME,
        api_key: c.env.CLOUDINARY_API_KEY,
        api_secret: c.env.CLOUDINARY_API_SECRET
    });
    
    await next();
})
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/v1', appRouter )

export default app
