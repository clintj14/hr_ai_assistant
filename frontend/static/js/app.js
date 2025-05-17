async function submitPrompt() {
  const userInputElement = document.getElementById("user-input");
  const responseDiv = document.getElementById("response");
  const avatarWrapper = document.getElementById("avatar-wrapper");
  const greeting = document.getElementById("assistant-greeting");

  const userInput = userInputElement.value.trim();
  if (!userInput) return;

  if (greeting) greeting.style.display = "none";
  userInputElement.value = "";
  responseDiv.innerHTML = "Thinking...";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await res.json();
    const raw = data.response.replace(/\r\n/g, "\n").trim();
    const lines = raw.split("\n");
    const merged = [];

    for (let i = 0; i < lines.length; i++) {
      const cur = lines[i].trim();

      if (/^\d+\.$/.test(cur)) {
        const stepNum = cur.replace(".", "");

        // Next non-empty line is heading
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        const heading = lines[j]?.trim() || "";

        // Next non-empty line is subtitle
        let k = j + 1;
        while (k < lines.length && !lines[k].trim()) k++;
        const subtitle = lines[k]?.trim() || "";

        // Merge into one span-tagged heading
        const fullHeading = `${stepNum}. ${heading}${subtitle ? " " + subtitle : ""}`;
        merged.push(`<span class="step-heading">${fullHeading}</span>`);
        i = k;
      } else {
        merged.push(cur);
      }
    }

    const mergedRaw = merged.join("\n");

    // Convert final line breaks to HTML
    let html = mergedRaw
      .replace(/\n{2,}/g, "<br><br>")
      .replace(/\n/g, "<br>")
      .replace(/\*\*/g, ""); // just in case: remove stray **

    // Apply animation
    avatarWrapper.classList.add("minimized");
    responseDiv.innerHTML = "";

    const words = html.split(" ");
    for (let w of words) {
      responseDiv.innerHTML += w + " ";
      await new Promise((r) => setTimeout(r, 40));
    }
  } catch (err) {
    console.error(err);
    responseDiv.innerHTML = "Error retrieving response.";
  }
}
