async function submitPrompt() {
    const userInput = document.getElementById('user-input').value;
    const responseDiv = document.getElementById('response');
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

        for (let i = 0; i < words.length; i++) {
            responseDiv.innerHTML += words[i] + ' ';
            await new Promise(resolve => setTimeout(resolve, 50));  // 50ms delay
        }
    } catch (err) {
        responseDiv.innerHTML = 'Error retrieving response.';
    }
}
