const chatbot = document.getElementById("chatbot");
const toggleBtn_ = document.getElementById("chatbotToggle");
const closeBtn = document.getElementById("chatbotClose");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("chatMessages");

toggleBtn_.onclick = () => {
  chatbot.style.display =
    chatbot.style.display === "flex" ? "none" : "flex";
};
closeBtn.onclick = () => chatbot.style.display = "none";

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user-message");
  input.value = "";

  setTimeout(() => {
    addMessage(getBotReply(text), "bot-message");
  }, 600);
}

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerHTML = text;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function includesAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

function getBotReply(question) {
  const q = normalize(question);

  // ===== CONTACT / SOCIAL =====
    if (includesAny(q, ["contact", "reach", "email", "social", "linkedin", "facebook"])) {
    return `
    You can reach Ahmed here 👇<br><br>

     <a href="https://www.linkedin.com/in/ahmed-diab-3b0631245/" target="_blank">LinkedIn</a><br>
     <a href="https://www.facebook.com/ahmed.diab.607858/" target="_blank">Facebook</a><br>
     <a href="https://x.com/AhmedDiap110531" target="_blank">X (Twitter)</a><br>
     <a href="https://www.youtube.com/@AhmedDi6b" target="_blank">YouTube</a>
    `;
    }

  // ===== GITHUB =====
  if (includesAny(q, ["github", "repo", "repositories", "code"])) {
    return `
     GitHub Profile:<br>
    <a href="https://github.com/ahmeddiab1234" target="_blank">
    github.com/ahmeddiab1234
    </a>
    `;
    }

  // ===== INTERNSHIP =====
  if (includesAny(q, ["intern", "internship", "trainee", "student"])) {
    return "Yes  Ahmed is open to internships and training opportunities.";
  }

  // ===== SKILLS / STACK =====
  if (includesAny(q, ["stack", "technology", "tech", "tools"])) {
    return `Tech Stack:
• Machine Learning & Deep Learning
• Computer Vision
• Backend Engineering (FastAPI)
• Python & Data Science`;
  }

  if (includesAny(q, ["projects", "work", "portfolio"])) {
    return `
    <br>

     <b>ML & AI</b><br>
    • <a href="https://github.com/ahmeddiab1234/mini-RAG" target="_blank">Mini-RAG</a><br>
    • <a href="https://github.com/ahmeddiab1234/Credit_Card_Fraud_Detection" target="_blank">Fraud Detection</a><br>
    • <a href="https://github.com/ahmeddiab1234/NYC_Trip_Duration" target="_blank">NYC Trip Duration</a><br>
    • <a href="https://github.com/ahmeddiab1234/End-to-End-Car-Price-prediction" target="_blank">Car Price Prediction</a><br>
    • <a href="https://github.com/ahmeddiab1234/Group_Activity_Recognition" target="_blank">Group Activity Recognition</a><br>
    • <a href="https://github.com/ahmeddiab1234/Will_it_rain_Analysis" target="_blank">Will it rain</a><br>
    • <a href="https://github.com/ahmeddiab1234/Group_Activity_Recognition" target="_blank">Group Activity Recognition</a><br>
   
     <b>Data AnalysisI</b><br>
    • <a href="https://github.com/ahmeddiab1234/Will_it_rain_Analysis" target="_blank">Will it rain</a><br>
    • <a href="https://github.com/ahmeddiab1234/SuperStor_EDA" target="_blank">Super store</a><br>
    • <a href="https://github.com/ahmeddiab1234/IEEE-CS--Amabsseador-AI-25/tree/main/Final_Project" target="_blank">Car Price Analysis</a><br>
    `;
    }


  // ===== PROBLEM SOLVING =====
  if (includesAny(q, ["leetcode", "codeforces", "cses", "problem", "competitive"])) {
    return `
    <br>

     <b>Problem Solving Profiles</b><br>
    • <a href="https://codeforces.com/profile/Ahmed_Di7b" target="_blank">Codeforces</a><br>
    • <a href="https://leetcode.com/u/f9QcZm2R1P/" target="_blank">LeetCode</a><br>
    • <a href="https://cses.fi/user/265415" target="_blank">CSES</a><br>
 `;
    }

    // ===== SKILLS / STACK =====
    if (includesAny(q, ["skills", "stack", "technology", "tech", "tools"])) {
    return `
    <b>Ahmed's Skills & Tech Stack:</b><br><br>

    • Machine Learning<br>
    • Deep Learning<br>
    • Computer Vision<br>
    • Data Science<br>
    • Mathematics<br>
    • Statistics & Probability<br>
    • Python<br>
    • C++<br>
    • HTML / CSS / JS<br>
    • FastAPI<br>
    • Flask<br>
    • Streamlit<br>
    • PostgreSQL<br>
    • SQL<br>
    • MongoDB<br>
    • Docker<br>
    • Kubernetes
    `;
    }

  // ===== LEARNING PROJECTS =====
  if (includesAny(q, ["learn", "practice", "beginner", "basic"])) {
    return `Learning / Practice Projects:
• Payroll System
• Employee Manager
• Hospital Management System
• Library System
• Contact Management System

All available on GitHub 👇
https://github.com/ahmeddiab1234`;
  }

  // ===== DEFAULT =====
  return `I can help with:
• Skills & tech stack
• Projects
• GitHub & problem solving
• Internships
• Contact info

Try asking naturally 🙂`;
}
