// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userroutes from './routes/userroutes.js';
import router from './routes/userroutes.js';
import userrouterrouter from './routes/userroutes.js';
import userrouter from './routes/userroutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/user',userrouter)

// Test route
app.get('/', (req, res) => {
  res.send('🚀 DevConnect API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
