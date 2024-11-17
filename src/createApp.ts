import express from 'express'
import usersRouter from './routes/users'
import cors from 'cors'
import coockieParser from 'cookie-parser'


export function createApp() {
    const app = express()
    
    app.use("/api/users", usersRouter)

    return app
}