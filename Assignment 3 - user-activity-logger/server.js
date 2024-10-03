const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(__dirname));

let logs = [];

// Endpoint to receive logs
app.post("/log", (req, res) => {
  const logEntry = req.body;

  // Check if action and timestamp are present
  if (!logEntry.action || !logEntry.timestamp) {
    return res
      .status(400)
      .json({ error: "Invalid log entry: missing action or timestamp." });
  }

  logs.push(logEntry);
  res.json({ message: "Log received", logEntry });
});

// Function to process and send logs every 2 minutes
setInterval(() => {
  if (logs.length > 0) {
    const summary = logs.map((log) => ({
      action: log.action,
      timestamp: log.timestamp,
    }));

    const batchSummary = {
      total: logs.length,
      interactions: summary, // Include individual actions and timestamps
    };

    // Log the batch summary to the console
    console.log("Batch Summary:", batchSummary);

    // Clear logs after processing
    logs = [];
  }
}, 120000);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
