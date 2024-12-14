// server.js (Express backend)
import express from 'express'
import cors from 'cors'
import { dbConnect } from './Database/connectDB.js';
import colors from 'colors'
import partnerRouter from './routes/partnerRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import assignmentRouter from './routes/assignmentRoutes.js'
import dotenv from 'dotenv'

dotenv.config()


const corsOptions = {
    origin: process.env.FRONTEND_URl, // Specify the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
};

const app=express()
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/partners',partnerRouter)
app.use('/api/orders',orderRouter)
app.use('/api/assignments',assignmentRouter)

dbConnect();


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.bgBlue.bold));
