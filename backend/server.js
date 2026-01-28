const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint - critical for distributed systems
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'infrawatch-backend'
  });
});

// Basic infrastructure status endpoint
app.get('/api/infrastructure/status', (req, res) => {
  res.json({
    services: [
      { name: 'Database', status: 'running', uptime: '99.9%' },
      { name: 'Cache', status: 'running', uptime: '99.8%' },
      { name: 'Load Balancer', status: 'running', uptime: '100%' }
    ],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`InfraWatch Backend running on port ${PORT}`);
});