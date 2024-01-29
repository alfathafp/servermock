const express = require("express");
const app = express();

// Import endpoint modules
const transactionModule = require("./transaction");
const userModule = require("./user");

// Use the endpoint modules in your main app
app.use("/api", transactionModule);
app.use("/api", userModule);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
