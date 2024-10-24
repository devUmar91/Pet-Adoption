import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import bodyParser from 'body-parser'; // Only necessary if using extended options
import authRoutes from './src/routes/authRoutes.js';
import petRoutes from './src/routes/petRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
// import errorHandler from './src/utils/errorHandler.js'; // Uncomment if needed

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // To handle JSON payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // To handle URL-encoded payloads

// Routes
app.use('/auth', authRoutes);
app.use('/pets', petRoutes);
app.use('/admin', adminRoutes);

// Error Handling
// app.use(errorHandler); // Uncomment if you have an error handling middleware

// Connect to Database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MONGO_URI:', process.env.MONGO_URI);
});
