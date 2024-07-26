import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/databaseConnection.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import foodRoutes from './routes/food.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: ["https://frontend-ashen-seven-18.vercel.app", "https://admin-panel-gilt-two.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

// Database connection
connectDB();

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/food', foodRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
