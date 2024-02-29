const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// Middleware for logging requests
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

router.get("/authuser", (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    return res.status(400).json({
      error: `there is a missing request body!`,
    });
  }
});

module.exports = router;
