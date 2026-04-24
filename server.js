const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const RAGPipeline = require('./backend/rag');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize RAG pipeline
let ragPipeline = null;

// Initialize RAG on startup
async function initializeRAG() {
  try {
    console.log('Initializing RAG pipeline...');
    ragPipeline = new RAGPipeline(
      process.env.LLM_PROVIDER || 'openai',
      path.join(__dirname, 'personal_info')
    );
    await ragPipeline.initialize();
    console.log('✓ RAG pipeline initialized successfully');
  } catch (error) {
    console.error('Error initializing RAG pipeline:', error);
    process.exit(1);
  }
}

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ragPipeline) {
      return res.status(503).json({ error: 'RAG pipeline not initialized' });
    }

    const response = await ragPipeline.query(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    ragInitialized: !!ragPipeline,
    llmProvider: process.env.LLM_PROVIDER || 'openai'
  });
});

// Start server
initializeRAG().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

module.exports = app;
