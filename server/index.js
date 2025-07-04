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

// URL Analysis endpoint
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid URL to analyze'
      });
    }

    // In production, you would extract text from the URL
    // For now, we'll use a mock response
    const mockText = "Scientists have discovered a new treatment for cancer that shows promising results in clinical trials. The research team published their findings in a peer-reviewed journal.";
    
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    try {
      // Analyze the extracted text
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
        text: mockText
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      res.json(response.data);
    } catch (mlError) {
      console.log('ML service not available for URL analysis, using mock response');
      
      // Mock URL analysis response
      const result = {
        prediction: 'REAL',
        confidence: Math.floor(Math.random() * 20) + 75, // 75-95% confidence
        message: 'URL analysis complete (mock response)',
        timestamp: new Date().toISOString(),
        source: url
      };
      
      res.json(result);
    }
  } catch (error) {
    console.error('URL analysis error:', error);
    res.status(500).json({ 
      error: 'URL analysis failed', 
      message: 'Failed to analyze the provided URL. Please check the URL and try again.' 
    });
  }
});

// Batch Analysis endpoint
app.post('/api/analyze-batch', async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ 
        error: 'Files are required',
        message: 'Please provide files to analyze'
      });
    }

    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const results = [];

    for (const file of files) {
      try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
          text: file.content
        }, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        results.push({
          fileName: file.name,
          result: response.data
        });
      } catch (mlError) {
        // Mock response for each file
        results.push({
          fileName: file.name,
          result: {
            prediction: Math.random() > 0.5 ? 'REAL' : 'FAKE',
            confidence: Math.floor(Math.random() * 30) + 65, // 65-95% confidence
            message: 'Batch analysis complete (mock response)',
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ 
      error: 'Batch analysis failed', 
      message: 'Failed to process batch files.' 
    });
  }
});

// Social Media Analysis endpoint
app.post('/api/analyze-social', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        error: 'Content is required',
        message: 'Please provide social media content to analyze'
      });
    }

    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
        text: content
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      res.json(response.data);
    } catch (mlError) {
      console.log('ML service not available for social media analysis, using mock response');
      
      // Mock social media analysis response
      const result = {
        prediction: content.toLowerCase().includes('breaking') || 
                   content.toLowerCase().includes('urgent') ||
                   content.toLowerCase().includes('shocking') ? 'FAKE' : 'REAL',
        confidence: Math.floor(Math.random() * 25) + 70, // 70-95% confidence
        message: 'Social media analysis complete (mock response)',
        timestamp: new Date().toISOString()
      };
      
      res.json(result);
    }
  } catch (error) {
    console.error('Social media analysis error:', error);
    res.status(500).json({ 
      error: 'Social media analysis failed', 
      message: 'Failed to analyze social media content.' 
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
