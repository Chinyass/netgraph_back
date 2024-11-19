import { createApp } from "./createApp";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app =  createApp()


const PORT = process.env.PORT


app.listen(PORT, async () => {
    
    const database_client = new PrismaClient()
    await database_client.$connect()
    
    console.log(`Running on port ${PORT}`)

})
