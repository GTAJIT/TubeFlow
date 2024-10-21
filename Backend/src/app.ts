import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
dotenv.config()
app.use(morgan('dev'))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes'
import videoRouter from './routes/video.routes'
import subscriptionRouter from './routes/subscription.routes'
import tweetRouter from './routes/tweet.routes'
import commentRouter from './routes/comment.routes'
app.use("/api/v1/user", userRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/comment', commentRouter)
export default app;