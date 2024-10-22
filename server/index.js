import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import bodyParser from "body-parser";
// import authRoutes from './routes/authRoutes.js';

import authRoutes from './src/routes/authRoutes.js'
import petRoutes from './src/routes/petRoutes.js';
import cookieParser from 'cookie-parser';
// import errorHandler from './src/utils/errorHandler.js';

const app = express();
app.use(cookieParser());

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/auth', authRoutes);
app.use('/pets', petRoutes);

// Error Handling
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log('MONGO_URI:', process.env.MONGO_URI);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to Database
connectDB();
