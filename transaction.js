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

app.get('v1/transaction', (req, res) => {
    
})


app.get('/payloadtest', (req, res) => {
    const { name, age } = req.body;
  
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required in the payload.' });
    }
  
    console.log('Received payloads:', { name, age });
    res.json({ name, age });
  });