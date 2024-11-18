import express from 'express'
import usersRouter from './routes/users'
import authRouter from './routes/auth'
import cors from 'cors'
import coockieParser from 'cookie-parser'


export function createApp() {
    const app = express()
    
    //Settings
    app.use(express.json())
    app.use(coockieParser())
    app.use(cors())

    //Routers
    app.use('/api/auth', authRouter)
    app.use("/api/users", usersRouter)
    
    return app
}