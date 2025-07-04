const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fake News Detection API Server', 
    status: 'running',
    endpoints: {
      predict: '/api/predict (POST)',
      health: '/api/health (GET)'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: 'Express.js',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Fake news prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required',
        message: 'Please provide text to analyze'
      });
    }

    if (text.length < 10) {
      return res.status(400).json({ 
        error: 'Text too short',
        message: 'Text must be at least 10 characters long'
      });
    }

    // For now, we'll use a mock response since ML service will be on Render
    // In production, this would forward to the ML service
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    let result;
    
    try {
      // Try to call the actual ML service
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
        text: text
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      result = response.data;
    } catch (mlError) {
      console.log('ML service not available, using mock response');
      
      // Mock response for development/testing
      // This simulates the ML model behavior
      const isFake = text.toLowerCase().includes('breaking') || 
                     text.toLowerCase().includes('urgent') ||
                     text.toLowerCase().includes('shocking') ||
                     text.toLowerCase().includes('unbelievable') ||
                     text.length < 50;
      
      result = {
        prediction: isFake ? 'FAKE' : 'REAL',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        message: 'Analysis complete (mock response - connect ML service for real predictions)',
        timestamp: new Date().toISOString()
      };
    }

    res.json(result);

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process the request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 API endpoint: http://localhost:${PORT}/api/predict`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
