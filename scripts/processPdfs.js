#!/usr/bin/env node
/**
 * Script to process PDFs and regenerate embeddings
 * Run with: npm run process-pdfs
 */

const path = require('path');
const RAGPipeline = require('./backend/rag');
require('dotenv').config();

async function processPDFs() {
  console.log('Starting PDF processing...\n');
  
  try {
    const ragPipeline = new RAGPipeline(
      process.env.LLM_PROVIDER || 'openai',
      path.join(__dirname, 'personal_info')
    );
    
    console.log(`LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
    console.log(`Vector Store: ${process.env.VECTOR_DB_PATH || './vector_store'}\n`);
    
    await ragPipeline.initialize();
    
    console.log('\n✅ PDF processing completed successfully!');
    console.log(`Total chunks created: ${ragPipeline.chunks.length}`);
    
  } catch (error) {
    console.error('❌ Error processing PDFs:', error.message);
    process.exit(1);
  }
}

processPDFs();
