import express from 'express';
import cors from 'cors';
import priceComparisonRoutes from './priceComparisonApi.js';

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0'; // Listen on all network interfaces

// Configure CORS for both development and production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://akash-pattar-real-time-electronic.onrender.com',
    /\.onrender\.com$/, // Allow all subdomains on render.com
    /\.vercel\.app$/ // Allow all subdomains on vercel.app
  ],
  credentials: true
}));

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/', priceComparisonRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
