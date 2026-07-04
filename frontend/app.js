// Minimal, well-commented JS for UI interactions and mock Gemini API call.

function convertMarkdown(mdInput) {
  var converter = new showdown.Converter(),
    text = mdInput,
    html = converter.makeHtml(text);
  return html;

}

const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('sendBtn');
const messagesEl = document.getElementById('messages');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const newChatBtn = document.getElementById('newChatBtn');

const API_URL = 'https://ai-chatbot-delta-ashen.vercel.app/';
const LOCAL_API_URL = 'http://localhost:3000/'

// Utility: scroll messages to bottom smoothly
function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  });
}

// Create and append a message bubble
function appendMessage({ text, role = 'ai', meta = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message ' + (role === 'user' ? 'user' : 'ai');

  if (meta) {
    const metaEl = document.createElement('div');
    metaEl.className = 'meta';
    metaEl.appendChild(document.createTextNode(meta));
    wrapper.appendChild(metaEl);
  }

  if (role === 'user') {
    const textEl = document.createElement('div');
    textEl.append(text);
    wrapper.appendChild(textEl);
  }
  if (role === 'ai') {
    const textEl = document.createElement('div');
    textEl.innerHTML = text;
    wrapper.appendChild(textEl);
  }

  messagesEl.appendChild(wrapper);
  scrollToBottom();
  return wrapper;
}

// Show typing indicator (returns element)
function showTyping() {
  const el = document.createElement('div');
  el.className = 'message ai';
  const typingWrap = document.createElement('div');
  typingWrap.className = 'typing';
  typingWrap.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    typingWrap.appendChild(d);
  }
  el.appendChild(typingWrap);
  messagesEl.appendChild(el);
  scrollToBottom();
  return el;
}

// Remove an element if present
function safeRemove(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

// Placeholder for the real Gemini API call
// Replace the internals of this function with a real fetch to the Gemini API.
async function fetchGeminiResponse(userMessage) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: userMessage
      })
    })
    const data = await res.json();
    return data.data
  } catch (error) {
    console.log('error occured');
    console.log(error);
  }
}

// Handle sending a message: render user message, show typing, call "API", render AI response
async function handleSend() {
  const text = promptEl.value.trim();
  if (!text) return;
  // Append user message
  appendMessage({ text, role: 'user', meta: 'You' });
  promptEl.value = '';
  promptEl.style.height = ''; // reset autosize
  // Show typing
  const typingEl = showTyping();

  try {
    const aiText = await fetchGeminiResponse(text);
    // Remove typing indicator
    if (!aiText) {
      safeRemove(typingEl);
      appendMessage({ text: 'Error: No response from API.', role: 'ai', meta: 'System' });
      return;
    }
    safeRemove(typingEl);
    appendMessage({ text: convertMarkdown(aiText), role: 'ai', meta: 'Gemini Assistant' });
  } catch (err) {
    safeRemove(typingEl);
    appendMessage({ text: 'Error: Unable to fetch response.', role: 'ai', meta: 'System' });
    console.log(err);
  }
}

// Send on button click
sendBtn.addEventListener('click', () => {
  handleSend();
});

// Handle Enter vs Shift+Enter in textarea
promptEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// Autosize textarea height
promptEl.addEventListener('input', () => {
  promptEl.style.height = 'auto';
  promptEl.style.height = Math.min(promptEl.scrollHeight, 140) + 'px';
});

// Mobile: toggle sidebar
sidebarToggle && sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// New chat button clears messages (simple behavior)
newChatBtn && newChatBtn.addEventListener('click', () => {
  messagesEl.innerHTML = '';
  const centerEl = document.createElement('div');
  centerEl.className = 'center';
  centerEl.innerHTML = `<div style="text-align:center"><div style="font-weight:700;font-size:18px">Start a conversation</div><div style="margin-top:6px;color:var(--muted)">Ask anything — the assistant will respond.</div></div>`;
  messagesEl.appendChild(centerEl);
  scrollToBottom();
});

// Accessibility: focus textarea on load
window.addEventListener('load', () => {
  promptEl.focus();
});

// Optional: Keyboard shortcut to toggle sidebar (Cmd/Ctrl+B)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
    e.preventDefault();
    sidebar.classList.toggle('open');
  }
});

// Small enhancement: click a sample chat-item to populate conversation (demo)
document.querySelectorAll('.chat-item').forEach((el, idx) => {
  el.addEventListener('click', () => {
    messagesEl.innerHTML = '';
    appendMessage({ text: 'Hello — this is a sample conversation starter.', role: 'ai', meta: 'Gemini Assistant' });
    appendMessage({ text: 'Thanks, tell me more about demo #' + (idx + 1), role: 'user', meta: 'You' });
    appendMessage({ text: 'Here is some additional info to illustrate how the UI looks.', role: 'ai', meta: 'Gemini Assistant' });
  });
});