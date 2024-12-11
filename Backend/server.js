// server.js (Express backend)
import express from 'express'
import cors from 'cors'
import { dbConnect } from './Database/connectDB.js';
import colors from 'colors'
import partnerRouter from './routes/partnerRoutes.js'
import orderRouter from './routes/orderRoutes.js'

const app=express()
app.use(cors());
app.use(express.json());

app.use('/api/partners',partnerRouter)
app.use('/api/orders',orderRouter)

dbConnect();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`.bgBlue.bold));
