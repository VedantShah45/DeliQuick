// server.js (Express backend)
import express from 'express'
import cors from 'cors'
import { dbConnect } from './Database/connectDB.js';
import colors from 'colors'
import partnerRouter from './routes/partnerRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import assignmentRouter from './routes/assignmentRoutes.js'
import dotenv from 'dotenv'
import { runCSVWorker } from './workers/runWorkers.js';

dotenv.config()

const corsOptions = {
    origin: [process.env.FRONTEND_URl,'http://localhost:5173'], // Specify the allowed origin
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
// runCSVWorker();

const PORT = process.env.PORT || 10000;

const ports=[3000,3001 , 3002];

for(const port of ports) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`.bgBlue.bold);
    });
}

