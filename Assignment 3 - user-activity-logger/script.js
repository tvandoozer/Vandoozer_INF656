document.getElementById("logButton").addEventListener("click", () => {
  logInteraction("Button clicked");
});

document.getElementById("logForm").addEventListener("submit", (event) => {
  event.preventDefault();
  logInteraction("Form submitted");
});

function logInteraction(action) {
  fetch("/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, timestamp: new Date().toISOString() }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => console.log("Server logged interaction:", data))
    .catch((error) => console.error("Error logging interaction:", error));
}
