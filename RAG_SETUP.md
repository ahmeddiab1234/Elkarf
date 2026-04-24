# RAG-Powered Chatbot Setup Guide

## Overview
Your chatbot now uses a **Retrieval Augmented Generation (RAG)** system that:
- Reads your PDF documents from the `personal_info/` folder
- Creates embeddings and indexes them in a vector database
- Retrieves relevant information when answering questions
- Uses AI to generate intelligent, context-aware responses

## Quick Start

### 1. Prerequisites
- Node.js (v14+) installed
- API keys for your chosen LLM provider

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Choose your LLM provider
LLM_PROVIDER=openai
# LLM_PROVIDER=groq

# For OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4-turbo

# For Groq (uses OpenAI embeddings)
GROQ_API_KEY=gsk-your-key-here
GROQ_CHAT_MODEL=mixtral-8x7b-32768

# Server
PORT=3001
```

### 4. Start the Server

```bash
npm start
```

You should see:
```
Initializing RAG pipeline...
✓ Extracted text from certificates.pdf
✓ Extracted text from linkedin_info.pdf
✓ Extracted text from ml_cv.pdf
✓ Extracted text from projects.pdf
✓ Created X chunks from PDFs
✓ Generated embeddings for X chunks
✓ Vector store initialized
🚀 Server running at http://localhost:3001
```

### 5. Test the Chatbot

- Open your website in a browser
- Click the chatbot toggle
- Ask questions like:
  - "What are your skills?"
  - "Tell me about your projects"
  - "What certificates do you have?"

## Switching Between LLM Providers

### Using OpenAI (Recommended for Quality)
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
OPENAI_CHAT_MODEL=gpt-4-turbo
```

**Get API Key:** https://platform.openai.com/api-keys

**Pricing:** ~$0.01-0.03 per conversation (depending on model)

### Using Groq Llama (Recommended for Speed & Cost)
```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-xxx
GROQ_CHAT_MODEL=mixtral-8x7b-32768
```

**Get API Key:** https://console.groq.com

**Pricing:** FREE tier available

## Architecture

```
┌─────────────────┐
│   Frontend UI   │ (chatbot.js)
│  (Browser)      │
└────────┬────────┘
         │ HTTP POST /api/chat
         ↓
┌─────────────────┐
│   Express       │ (server.js)
│   Server        │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
┌────────┐  ┌──────────┐
│  RAG   │  │  Vector  │
│Pipeline│  │  Store   │
└───┬────┘  └──────────┘
    │
    ├─→ Retrieve: PDF chunks from vector DB
    ├─→ Rank: Find most relevant matches
    └─→ Generate: LLM creates response
         │
    ┌────▼────────────────┐
    │  LLM (OpenAI/Groq)  │
    └─────────────────────┘
```

## How RAG Works

1. **Indexing** (Happens once on startup)
   - PDFs are read and converted to text
   - Text is split into manageable chunks
   - Each chunk gets an embedding (vector representation)
   - Embeddings are stored in a vector database

2. **Query Processing** (Happens per user message)
   - User's question is converted to an embedding
   - Vector DB searches for similar chunk embeddings
   - Top 5 most relevant chunks are retrieved
   - Chunks + question are sent to LLM with context

3. **Response Generation**
   - LLM uses retrieved context to answer accurately
   - Response is streamed back to the user

## File Structure

```
personal_info/
├── certificates.pdf       # Your certifications
├── linkedin_info.pdf      # LinkedIn profile info
├── ml_cv.pdf             # ML/CV projects & experience
└── projects.pdf          # Detailed project descriptions

backend/
└── rag.js               # RAG pipeline implementation

scripts/
└── chatbot.js           # Updated frontend (now uses API)

server.js                # Express server
package.json             # Dependencies
.env                     # Configuration (not in git)
.env.example             # Example configuration
vector_store/            # Auto-created local vector DB
```

## Troubleshooting

### "Connection error: Cannot reach server"
- Make sure `npm start` is running
- Check if port 3001 is available
- Try: `netstat -ano | findstr :3001`

### "Cannot read PDF files"
- Ensure PDFs are in `personal_info/` folder
- Check file permissions
- PDFs should not be encrypted

### "API key error"
- Double-check your `.env` file
- Ensure keys have no extra spaces
- For OpenAI: starts with `sk-`
- For Groq: starts with `gsk-`

### "Vector store not initialized"
- Check server console for PDF processing errors
- Ensure at least one PDF is readable
- Try deleting `vector_store/` and restarting

## Customization

### Change Chunk Size
Edit [backend/rag.js](backend/rag.js), function `chunkDocuments()`:
```javascript
// Increase for larger context, decrease for faster retrieval
const chunkSize = 1000;  // default: 500
```

### Change Number of Retrieved Chunks
Edit [backend/rag.js](backend/rag.js), function `query()`:
```javascript
const results = await this.table.search(queryEmbedding).limit(10);  // default: 5
```

### Change Response Temperature
Edit [backend/rag.js](backend/rag.js):
```javascript
temperature: 0.7,  // 0=deterministic, 1=creative
```

## Performance Tips

1. **Use Groq for Speed** - Much faster responses, free tier available
2. **Optimize PDF Content** - Remove unnecessary text/images before indexing
3. **Cache Embeddings** - Vector DB caches are auto-managed
4. **Batch Queries** - During peak usage, responses queue automatically

## Production Deployment

For production, consider:
1. Use managed vector DB (Pinecone, Weaviate)
2. Add authentication to `/api/chat` endpoint
3. Implement rate limiting
4. Use environment-specific configurations
5. Add logging and monitoring
6. Host on platforms like Render, Railway, or AWS

## Advanced Features (Future)

- [ ] Chat history storage
- [ ] Multiple knowledge bases
- [ ] Web scraping to auto-update PDFs
- [ ] Multi-language support
- [ ] User feedback for RAG improvement
- [ ] Analytics dashboard

## Support

For issues or questions, check:
- LLM provider documentation
- Vector store (LanceDB) docs
- Express.js documentation
