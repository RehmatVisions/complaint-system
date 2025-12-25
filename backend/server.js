import express from 'express';
import { connectDB } from './config/db.js'; // make sure the file name matches

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Project structure already set up. Just add your files and start working on port ${port}`);
});
