const UserAgent = require("user-agents");
const express = require("express");
const bodyParser = require("body-parser");
const device = require("express-device");
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  // Your response logic
  res.send("Hello World!");
});

app.get("/testing", (req, res) => {
  res.json({
    path: req.path,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    protocol: req.protocol,
  });
});

app.get("/payloadtest", (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res
      .status(400)
      .json({ error: "Name and age are required in the payload." });
  }

  console.log("Received payloads:", { name, age });
  res.json({ name, age });
});

app.get("/queryparamtest", (req, res) => {
  const { name, age } = req.query;

  handleError(res, { name, age });

  console.log("Received request:", { name, age });
  res.json({ name, age });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function handleError(res, { name, age }) {
  let errorCode = 400;
  let errorMessage = "";
  let validAge = 20;

  // Process specific error cases
  if (!name || !age) {
    errorMessage += " Name and age are required in the query parameters.";
  }

  if (isNaN(age)) {
    errorMessage += ` You must enter a valid number. ${age} is not a valid number.`;
  }

  if (age <= validAge) {
    errorCode = 201;
    errorMessage += ` Age must be more than ${validAge} years.`;
  }

  if (errorMessage !== "") {
    return res.status(errorCode).json({ error: errorMessage });
  }
}
