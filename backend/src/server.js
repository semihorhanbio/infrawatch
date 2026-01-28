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

// Disk usage monitoring endpoint
app.get('/api/infrastructure/disk-usage', (req, res) => {
  const os = require('os');
  const { execSync } = require('child_process');

  try {
    // Get disk usage information using df command
    const dfOutput = execSync('df -h /').toString();
    const lines = dfOutput.trim().split('\n');
    const diskInfo = lines[1].split(/\s+/);

    // Parse disk information
    const totalDisk = diskInfo[1];
    const usedDisk = diskInfo[2];
    const availableDisk = diskInfo[3];
    const usagePercent = diskInfo[4];

    // Get memory information
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

    res.json({
      disk: {
        total: totalDisk,
        used: usedDisk,
        available: availableDisk,
        usagePercent: usagePercent,
        mountPoint: '/'
      },
      memory: {
        total: `${(totalMemory / (1024 ** 3)).toFixed(2)} GB`,
        used: `${(usedMemory / (1024 ** 3)).toFixed(2)} GB`,
        free: `${(freeMemory / (1024 ** 3)).toFixed(2)} GB`,
        usagePercent: `${memoryUsagePercent}%`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve disk usage information',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`InfraWatch Backend running on port ${PORT}`);
});