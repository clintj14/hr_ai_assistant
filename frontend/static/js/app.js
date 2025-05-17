async function submitPrompt() {
  const userInput = document.getElementById('user-input').value;
  const responseDiv = document.getElementById('response');
  const avatarWrapper = document.getElementById('avatar-wrapper');

  if (!userInput.trim()) return;

  // ✅ Hide initial greeting
  const greeting = document.getElementById('assistant-greeting');
  if (greeting) {
    greeting.style.display = 'none';
  }

  responseDiv.innerHTML = 'Thinking...';

  try {
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await res.json();
    const words = data.response.split(' ');
    responseDiv.innerHTML = '';

    // Shrink/move avatar
    avatarWrapper.classList.add('minimized');

    for (let i = 0; i < words.length; i++) {
      responseDiv.innerHTML += words[i] + ' ';
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  } catch (err) {
    responseDiv.innerHTML = 'Error retrieving response.';
  }
}
