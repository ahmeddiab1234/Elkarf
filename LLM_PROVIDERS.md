# LLM Provider Comparison

## OpenAI vs Groq

| Feature | OpenAI | Groq |
|---------|--------|------|
| **Response Quality** | Excellent (GPT-4) | Very Good (Llama) |
| **Speed** | Good | ⚡ Blazing Fast |
| **Cost** | Paid | Free tier available |
| **Availability** | Always available | High uptime |
| **Embeddings** | ✅ Built-in | ⚠️ Uses OpenAI |
| **Context Length** | 8k-128k tokens | 32k tokens |

## Choosing Your Provider

### Use OpenAI if:
- Quality is your top priority
- You want the latest AI models
- You're willing to pay for reliability
- You need long context windows

### Use Groq if:
- Speed matters most
- Budget is limited
- You want free tier
- Response time < 1 second is critical

## How to Switch

### Step 1: Get API Key
- **OpenAI**: https://platform.openai.com/api-keys
- **Groq**: https://console.groq.com

### Step 2: Update `.env` file
```bash
# For OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxx

# For Groq
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-xxxxxxxx
```

### Step 3: Restart server
```bash
npm start
```

## Model Selection

### OpenAI Models
```javascript
// Fastest/Cheapest
gpt-3.5-turbo

// Balanced (Recommended)
gpt-4-turbo

// Most Powerful
gpt-4-turbo-preview
```

### Groq Models
```javascript
// Fastest (Recommended)
mixtral-8x7b-32768

// Smaller
llama-2-70b-chat

// New
llama3-70b-8192
```

## Cost Estimates (USD)

### OpenAI GPT-4-Turbo
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens
- Per conversation: ~$0.02-0.05

### Groq
- Free tier: 30 requests/minute
- Paid: Extremely affordable (~$0.001 per 1K tokens)

## Example: Switching to Groq

```env
# .env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-proj_abc123def456xyz
GROQ_CHAT_MODEL=mixtral-8x7b-32768
PORT=3001
OPENAI_API_KEY=sk-needed-for-embeddings
```

Restart: `npm start`

Now all chats use Groq! ⚡
