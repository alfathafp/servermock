// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const port = 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Middleware for logging requests
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// // return res.status(errorCode).json({ error: errorMessage });

// app.get("/v1/transaction", (req, res) => {
//   const { transactionId, orderId, amount, transactionStatus } = req.body;
//   let transactionResponse = null;

//   if (!transactionId || !orderId || !amount || !transactionStatus) {
//     return res.status(400).json({
//       error: `there is a missing request body!`,
//     });
//   }

//   if (transactionStatus === 10) {
//     transactionResponse = {
//       transactionId: transactionId,
//       orderId: orderId,
//       amount: amount,
//       transactionStatus: 4,
//     };
//   } else if (transactionStatus === 5) {
//     return res
//       .status(200)
//       .json({ failedDesc: "transction denied from kredivo side" });
//   } else {
//     return res
//       .status(400)
//       .json({ failedDesc: "status is not settle from kredivo site" });
//   }

//   res.status(200).json(transactionResponse);
// });

// app.get("/payloadtest", (req, res) => {
//   const { name, age } = req.body;

//   if (!name || !age) {
//     return res
//       .status(400)
//       .json({ error: "Name and age are required in the payload." });
//   }

//   console.log("Received payloads:", { name, age });
//   res.json({ name, age });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// netlify/functions/transaction.js

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// your-function.js
exports.handler = async (event, context) => {
  // Your function logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from your Netlify function!" }),
  };
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/v1/transaction", (req, res) => {
  const { transactionId, orderId, amount, transactionStatus } = req.body;
  let transactionResponse = null;

  if (!transactionId || !orderId || !amount || !transactionStatus) {
    return res.status(400).json({
      error: `There is a missing request body!`,
    });
  }

  if (transactionStatus === 10) {
    transactionResponse = {
      transactionId: transactionId,
      orderId: orderId,
      amount: amount,
      transactionStatus: 4,
    };
  } else if (transactionStatus === 5) {
    return res
      .status(200)
      .json({ failedDesc: "Transaction denied from Kredivo side" });
  } else {
    return res
      .status(400)
      .json({ failedDesc: "Status is not settled from Kredivo site" });
  }

  res.status(200).json(transactionResponse);
});

module.exports = app;
