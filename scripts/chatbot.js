const chatbot = document.getElementById("chatbot");
const toggleBtn_ = document.getElementById("chatbotToggle");
const closeBtn = document.getElementById("chatbotClose");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("chatMessages");

// API Configuration
const API_URL = 'http://localhost:3001';
let isLoading = false;

toggleBtn_.onclick = () => {
  chatbot.style.display =
    chatbot.style.display === "flex" ? "none" : "flex";
};
closeBtn.onclick = () => chatbot.style.display = "none";

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter" && !isLoading) sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text || isLoading) return;

  addMessage(text, "user-message");
  input.value = "";

  isLoading = true;
  sendBtn.disabled = true;

  try {
    // Show loading indicator
    const loadingId = addMessage("⏳ Thinking...", "bot-message");
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      updateMessage(loadingId, `❌ Error: ${errorData.error || 'Unknown error'}`);
      return;
    }

    const data = await response.json();
    updateMessage(loadingId, data.response);
  } catch (error) {
    console.error('Chat error:', error);
    addMessage(`❌ Connection error: ${error.message}. Make sure the server is running on port 3001.`, "bot-message");
  } finally {
    isLoading = false;
    sendBtn.disabled = false;
  }
}

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerHTML = text;
  msg.id = 'msg-' + Date.now();

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  
  return msg.id;
}

function updateMessage(messageId, newText) {
  const msg = document.getElementById(messageId);
  if (msg) {
    msg.innerHTML = newText;
    messages.scrollTop = messages.scrollHeight;
  }
}

// Note: All responses now come from the RAG backend using PDF knowledge base
// The chatbot automatically retrieves relevant information from:
// - certificates.pdf
// - linkedin_info.pdf
// - ml_cv.pdf
// - projects.pdf
// • Projects
// • GitHub & problem solving
// • Internships
// • Contact info

// Try asking naturally 🙂`;
// }
