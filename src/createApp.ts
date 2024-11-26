import express from 'express'

import usersRouter from './routes/users'
import authRouter from './routes/auth'
import nodesRouter from './routes/nodes'
import locationRouter from './routes/locations'
import roleRouter from './routes/roles'
import zoneRouter from './routes/zone'
import localityRouter from './routes/locality'
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
    app.use('/api/nodes', nodesRouter)
    app.use("/api/users", usersRouter)
    app.use('/api/locations', locationRouter)
    app.use('/api/roles', roleRouter)
    app.use('/api/zones', zoneRouter)
    app.use('/api/locality', localityRouter)
    
    return app
}