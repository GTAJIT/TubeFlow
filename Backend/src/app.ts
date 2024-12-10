import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
declare global {
    namespace Express {
      interface Request {
            userId?: string;
      }
    }
  }   
const app = express()
dotenv.config()

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
    credentials: true // If using cookies or session-based auth
}))
app.use(morgan('dev'))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes'
import videoRouter from './routes/video.routes'
import subscriptionRouter from './routes/subscription.routes'
import tweetRouter from './routes/tweet.routes'
import commentRouter from './routes/comment.routes'
import likeRouter from './routes/like.routes'
import playlistRouter from './routes/playlist.routes'
import dashboardRouter from './routes/dashboard.routes'
app.use("/api/v1/user", userRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/like', likeRouter);
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use('/server-status', (req, res)=>{
  res.send("server working")
})
export default app;