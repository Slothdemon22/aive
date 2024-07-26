import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS configuration to allow all origins
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    credentials: true // Allow credentials (cookies, etc.)
}));

app.use(cookieParser());
app.use(express.json());

// Define your routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
