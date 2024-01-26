const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/testing', (req, res) => {
  res.json({
    path: req.path,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    protocol: req.protocol,
  });
});

app.get('/payloadtest', (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required in the payload.' });
  }

  console.log('Received payloads:', { name, age });
  res.json({ name, age });
});

app.get('/queryparamtest', (req, res) => {
  const { name, age } = req.query;

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required in the query parameters.' });
  }

  console.log('Received request:', { name, age });
  res.json({ name, age });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
