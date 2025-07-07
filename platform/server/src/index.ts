// BTMM Trading System - Server Entry Point

import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BTMM Trading System Server Running' });
});

app.get('/api/strategies', (req, res) => {
  res.json({ strategies: [] });
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 BTMM Server running on port ${PORT}`);
});
