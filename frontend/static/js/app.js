async function submitPrompt() {
  const userInput = document.getElementById('user-input').value;
  const responseDiv = document.getElementById('response');
  const avatarWrapper = document.getElementById('avatar-wrapper');
  const greeting = document.getElementById('assistant-greeting');

  if (!userInput.trim()) return;

  // Hide initial greeting
  if (greeting) {
    greeting.style.display = 'none';
  }

  // Show loading state
  responseDiv.innerHTML = 'Thinking...';

  try {
    // Send user input to backend
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await res.json();

    // Format response with simple markdown-like formatting
    let formattedHtml = data.response
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold section titles
      .replace(/\n{2,}/g, '<br><br>')                    // Paragraph breaks
      .replace(/\n/g, '<br>');                           // Single line breaks

    // Move avatar to corner
    avatarWrapper.classList.add('minimized');

    // Clear placeholder
    responseDiv.innerHTML = '';

    // Typing animation — word by word
    const words = formattedHtml.split(' ');
    for (let i = 0; i < words.length; i++) {
      responseDiv.innerHTML += words[i] + ' ';
      await new Promise(resolve => setTimeout(resolve, 40)); // Typing speed
    }

  } catch (err) {
    responseDiv.innerHTML = 'Error retrieving response.';
    console.error(err);
  }
}
