let chatMemory = [];

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function appendMessage(content, type) {
  const chatHistory = document.getElementById("chat-history");

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}-message`;

  const time = document.createElement("span");
  time.className = "timestamp";
  time.textContent = formatTime();

  bubble.innerHTML = content;
  bubble.appendChild(time);
  chatHistory.appendChild(bubble);

  chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function submitPrompt() {
  const userInputElement = document.getElementById("user-input");
  const chatHistory = document.getElementById("chat-history");
  const userText = userInputElement.value.trim();
  const greeting = document.getElementById("assistant-greeting");

  if (!userText) return;
  if (greeting) greeting.style.display = "none";

  userInputElement.value = "";

  // Show user message
  chatMemory.push({ role: "user", content: userText });
  appendMessage(userText, "user");

  // Placeholder AI message
  const aiBubble = document.createElement("div");
  aiBubble.className = "chat-bubble ai-message";
  aiBubble.innerHTML = "Thinking...";
  chatHistory.appendChild(aiBubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userText })
    });

    const data = await res.json();
    const raw = data.response.replace(/\r\n/g, "\n").trim();

  let html = raw
    .replace(/\r\n/g, "\n")

    // Convert ### headings to section titles
    .replace(/^###\s+(.*)$/gm, '<div class="section-heading">$1</div>')

    // Format numbered steps by bolding the full line up to the colon
    .replace(/^(\d+\.\s+[^:\n]+:)/gm, "<strong>$1</strong>")

    // Standard bold markdown
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Convert line breaks
    .replace(/\n{2,}/g, "<br><br>")
    .replace(/\n/g, "<br>");



    aiBubble.innerHTML = "";
    const words = html.split(" ");
    for (let word of words) {
      aiBubble.innerHTML += word + " ";
      await new Promise((r) => setTimeout(r, 30));
    }

    const time = document.createElement("span");
    time.className = "timestamp";
    time.textContent = formatTime();
    aiBubble.appendChild(time);

    chatMemory.push({ role: "assistant", content: data.response });
    chatHistory.scrollTop = chatHistory.scrollHeight;

  } catch (err) {
    aiBubble.textContent = "Something went wrong.";
    console.error(err);
  }
}

// // Optional: Persist chat on refresh
// window.addEventListener("DOMContentLoaded", () => {
//   const history = JSON.parse(localStorage.getItem("chatMemory")) || [];
//   chatMemory = history;
//   history.forEach(msg => appendMessage(msg.content, msg.role));
// });
//
// window.addEventListener("beforeunload", () => {
//   localStorage.setItem("chatMemory", JSON.stringify(chatMemory));
// });
