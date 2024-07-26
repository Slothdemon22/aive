import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { connectDB } from "./db/databaseConnection.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js"
import foodRoutes from "./routes/food.routes.js"
import cookieParser from "cookie-parser";

dotenv.config();





const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    credentials: true // Allow credentials (cookies, etc.)
}));

connectDB();
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/food', foodRoutes);
app.get('/', (req, res) => {
    res.send("Hello World");
})
app.listen(process.env.PORT||3000, () => console.log("Server is running on port 3000"))
