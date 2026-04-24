const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const OpenAI = require('openai');
const Groq = require('groq-sdk');

class RAGPipeline {
  constructor(llmProvider = 'openai', pdfPath = './personal_info') {
    this.llmProvider = llmProvider;
    this.pdfPath = pdfPath;
    this.chunks = [];
    this.vectorCache = null;
    
    // Initialize LLM clients
    if (llmProvider === 'openai' || llmProvider === 'groq') {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
    }
    
    if (llmProvider === 'groq') {
      this.groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
    
    this.chatModel = process.env[llmProvider === 'groq' ? 'GROQ_CHAT_MODEL' : 'OPENAI_CHAT_MODEL'] || 
                    (llmProvider === 'groq' ? 'mixtral-8x7b-32768' : 'gpt-4-turbo');
  }

  async initialize() {
    try {
      // Extract text from all PDFs
      const documents = await this.extractPDFs();
      
      // Split documents into chunks
      this.chunks = this.chunkDocuments(documents);
      console.log(`✓ Created ${this.chunks.length} chunks from PDFs`);

      // Generate embeddings (with fallback to keyword search)
      await this.generateEmbeddings();
      console.log(`✓ Initialized retrieval system`);
    } catch (error) {
      throw new Error(`RAG initialization failed: ${error.message}`);
    }
  }

  async extractPDFs() {
    const documents = [];
    const files = fs.readdirSync(this.pdfPath);
    
    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const filePath = path.join(this.pdfPath, file);
        const dataBuffer = fs.readFileSync(filePath);
        
        try {
          const data = await pdf(dataBuffer);
          documents.push({
            source: file,
            content: data.text,
          });
          console.log(`Extracted text from ${file} (${data.numpages} pages)`);
        } catch (error) {
          console.warn(`Warning: Could not parse ${file}: ${error.message}`);
        }
      }
    }
    
    if (documents.length === 0) {
      throw new Error('No PDFs found or could be parsed');
    }
    
    return documents;
  }

  chunkDocuments(documents, chunkSize = 500, overlap = 100) {
    const chunks = [];
    
    for (const doc of documents) {
      const text = doc.content;
      const sentences = text.split(/(?<=[.!?])\s+/);
      
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length < chunkSize) {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        } else {
          if (currentChunk) {
            chunks.push({
              content: currentChunk.trim(),
              source: doc.source,
              metadata: { source: doc.source },
            });
          }
          currentChunk = sentence;
        }
      }
      
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          source: doc.source,
          metadata: { source: doc.source },
        });
      }
    }
    
    return chunks;
  }

  async generateEmbeddings() {
    // Use OpenAI embeddings only if available, otherwise use TF-IDF
    if (this.llmProvider === 'openai') {
      this.vectorCache = {};
      
      for (let i = 0; i < this.chunks.length; i += 10) {
        const batchChunks = this.chunks.slice(i, i + 10);
        const texts = batchChunks.map(c => c.content);
        
        try {
          const response = await this.openaiClient.embeddings.create({
            model: this.embeddingModel,
            input: texts,
          });
          
          batchChunks.forEach((chunk, idx) => {
            chunk.embedding = response.data[idx].embedding;
            this.vectorCache[i + idx] = chunk;
          });
        } catch (error) {
          console.warn('OpenAI embeddings failed, using keyword matching instead');
          batchChunks.forEach((chunk, idx) => {
            chunk.embedding = null;
            this.vectorCache[i + idx] = chunk;
          });
        }
        
        console.log(`Processed ${Math.min(i + 10, this.chunks.length)}/${this.chunks.length} chunks`);
      }
    } else {
      // For Groq: use keyword-based matching (no API calls)
      console.log('Using keyword-based retrieval (no external API calls needed)');
      this.chunks.forEach((chunk, idx) => {
        chunk.embedding = null;
        this.vectorCache = this.vectorCache || {};
        this.vectorCache[idx] = chunk;
      });
    }
  }

  // Cosine similarity
  cosineSimilarity(vec1, vec2) {
    if (!vec1 || !vec2) return 0;
    const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return mag1 === 0 || mag2 === 0 ? 0 : dotProduct / (mag1 * mag2);
  }

  // Keyword-based similarity
  keywordSimilarity(query, text) {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const textWords = text.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const word of queryWords) {
      if (textWords.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    }
    
    return queryWords.length > 0 ? matches / queryWords.length : 0;
  }

  async query(userQuery) {
    try {
      // Try to use embeddings if available, fall back to keyword matching
      let topResults;
      
      if (this.chunks.some(c => c.embedding)) {
        // Use embedding-based search
        const queryEmbedding = await this.generateQueryEmbedding(userQuery);
        
        const similarities = this.chunks.map((chunk, idx) => ({
          index: idx,
          chunk: chunk,
          similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
        }));
        
        topResults = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5);
      } else {
        // Use keyword-based search
        const similarities = this.chunks.map((chunk, idx) => ({
          index: idx,
          chunk: chunk,
          similarity: this.keywordSimilarity(userQuery, chunk.content),
        }));
        
        topResults = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 5)
          .filter(r => r.similarity > 0);
      }
      
      // Get relevant context
      const context = topResults.length > 0
        ? topResults.map(r => `[${r.chunk.source}]\n${r.chunk.content}`).join('\n\n---\n\n')
        : 'No specific information found in documents.';

      // Generate response with LLM
      const response = await this.generateResponse(userQuery, context);
      
      return response;
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  async generateQueryEmbedding(query) {
    try {
      const response = await this.openaiClient.embeddings.create({
        model: this.embeddingModel,
        input: query,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.warn('Query embedding failed, using keyword matching');
      return null;
    }
  }

  async generateResponse(userQuery, context) {
    if (this.llmProvider === 'openai') {
      return await this.generateOpenAIResponse(userQuery, context);
    } else if (this.llmProvider === 'groq') {
      return await this.generateGroqResponse(userQuery, context);
    }
  }

  async generateOpenAIResponse(userQuery, context) {
    const systemPrompt = `You are Ahmed's personal AI assistant. Your goal is to answer questions BRIEFLY and SIMPLY.

IMPORTANT RULES:
1. Give SHORT, concise answers (1-3 sentences max for initial response)
2. Do NOT provide long lists or extensive details in first response
3. If the user asks for "more", "details", "tell me more", or similar - then provide detailed information
4. Use simple language and be conversational
5. If information is not in documents, say "I don't have that information."

Provided context from Ahmed's documents:
${context}`;

    const response = await this.openaiClient.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  }

  async generateGroqResponse(userQuery, context) {
    const systemPrompt = `You are Ahmed's personal AI assistant. Your goal is to answer questions BRIEFLY and SIMPLY.

IMPORTANT RULES:
1. Give SHORT, concise answers (1-3 sentences max for initial response)
2. Do NOT provide long lists or extensive details in first response
3. If the user asks for "more", "details", "tell me more", or similar - then provide detailed information
4. Use simple language and be conversational
5. If information is not in documents, say "I don't have that information."

Provided context from Ahmed's documents:
${context}`;

    const response = await this.groqClient.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  }
}

module.exports = RAGPipeline;
