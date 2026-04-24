# RAG Chatbot Implementation - Quick Reference

## What's New?

Your chatbot is now powered by **Retrieval Augmented Generation (RAG)** with flexible LLM support:

✅ **Smart**: Reads your PDFs and answers questions from your actual data
✅ **Flexible**: Switch between OpenAI and Groq with one config change
✅ **Fast**: Groq option provides sub-second responses
✅ **Accurate**: Uses vector embeddings to find the most relevant information

## Files Created/Modified

### Backend
- **`server.js`** - Express server
- **`backend/rag.js`** - RAG pipeline implementation
- **`package.json`** - Dependencies
- **`scripts/processPdfs.js`** - PDF processing script

### Configuration
- **`.env.example`** - Configuration template (copy to `.env`)
- **`.gitignore`** - Git ignore rules

### Frontend
- **`scripts/chatbot.js`** - Updated to use API instead of static data

### Documentation
- **`RAG_SETUP.md`** - Complete setup guide
- **`LLM_PROVIDERS.md`** - OpenAI vs Groq comparison
- **`start.bat`** / **`start.sh`** - Quick start scripts

## Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure API Keys

**Option A: Using OpenAI** (Better quality)
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add:
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

Get OpenAI key: https://platform.openai.com/api-keys

**Option B: Using Groq** (Free, faster)
```bash
# Edit .env and add:
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-your-key-here
```

Get Groq key: https://console.groq.com

### 3️⃣ Start Server
```bash
npm start
```

### 4️⃣ Open Website
Your chatbot will now use the RAG system!

## How to Switch LLMs

Just change one line in `.env`:
```bash
# For OpenAI
LLM_PROVIDER=openai

# For Groq
LLM_PROVIDER=groq
```

Restart the server - that's it!

## Test It

1. Start the server: `npm start`
2. Open your website
3. Ask your chatbot questions like:
   - "What are your skills?"
   - "Tell me about your ML projects"
   - "What certifications do you have?"

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/rag.js` | RAG engine - retrieves and answers |
| `server.js` | API server |
| `scripts/chatbot.js` | Frontend UI (updated for API) |
| `.env` | Your API keys (keep secret!) |

## Troubleshooting

**Error: "Connection error"**
- Make sure server is running: `npm start`
- Check port 3001 is available

**Error: "Cannot read PDFs"**
- PDFs are in `personal_info/` folder
- Check they're not corrupted or encrypted

**Error: "API key invalid"**
- Check your `.env` file has correct keys
- No extra spaces around values

**Error: "Vector store not initialized"**
- Check server console for errors
- Try deleting `vector_store/` folder and restart

## Next Steps

1. ✅ Install and configure
2. ✅ Get API key (OpenAI or Groq)
3. ✅ Run `npm start`
4. ✅ Test the chatbot
5. 🔄 (Optional) Customize RAG parameters in `backend/rag.js`

## Documentation Links

- [Complete Setup Guide](RAG_SETUP.md)
- [LLM Provider Comparison](LLM_PROVIDERS.md)
- [Groq API Docs](https://groq.com)
- [OpenAI API Docs](https://platform.openai.com/docs)

## Architecture at a Glance

```
User Message
    ↓
[Frontend: chatbot.js]
    ↓
[Express Server: server.js]
    ↓
[RAG Pipeline: backend/rag.js]
    ├─ Search Vector DB
    ├─ Retrieve PDF chunks
    └─ Send to LLM
    ↓
[LLM: OpenAI/Groq]
    ├─ Read context
    ├─ Generate response
    └─ Return answer
    ↓
Display to User
```

---

**Need help?** Check `RAG_SETUP.md` for detailed troubleshooting!
