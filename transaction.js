const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// return res.status(errorCode).json({ error: errorMessage });

app.get("/v1/transaction", (req, res) => {
  const { transactionId, orderId, amount, transactionStatus } = req.body;
  let transactionResponse = null;

  const key =
    "6c9339971b60f8de7b03582240dfea87af83ff51cac11feb56a6d94281aedcdd"; // random 32
  const iv = Buffer.from("be6349e72ec8b121e8748a22c4dd0335", "hex");

  if (!transactionId || !orderId || !amount || !transactionStatus) {
    return res.status(400).json({
      error: `there is a missing request body!`,
    });
  }

  if (transactionStatus === 10) {
    let encryptedText = encrypt(transactionId, orderId, amount, key, iv);
    let decryptedText = decrypt(encryptedText, key, iv);
    transactionResponse = {
      transactionId: transactionId,
      orderId: orderId,
      amount: amount,
      transactionStatus: 4,
      transactionToken: encryptedText,
      decryptedText: decryptedText,
    };
  } else if (transactionStatus === 5) {
    return res
      .status(200)
      .json({ failedDesc: "transction denied from kredivo side" });
  } else {
    return res
      .status(400)
      .json({ failedDesc: "status is not settle from kredivo site" });
  }

  res.status(200).json(transactionResponse);
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

function decrypt(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  // Splitting the string using '*'
  const parts = decryptedData.split("*");

  // Assuming parts are transactionId, orderId, and amount
  const transactionId = parts[0];
  const orderId = parts[1];
  const amountStr = parts[2];
  console.log(transactionId);
  console.log(orderId);
  console.log(amountStr);
  return decryptedData;
}

function encrypt(transactionId, orderId, amount, key, iv) {
  const plaintext = transactionId + "*" + orderId + "*" + amount;
  console.log("plaintext: ", plaintext);

  const algorithm = "aes-256-cbc";

  // Check if the key is a valid hexadecimal string
  if (!/^[0-9a-fA-F]+$/.test(key)) {
    console.error("Invalid key format. Must be a valid hexadecimal string.");
    process.exit(1);
  }

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);

  let encryptedData = cipher.update(plaintext, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// netlify/functions/transaction.js

// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();

// // your-function.js
// exports.handler = async (event, context) => {
//   // Your function logic here
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: "Hello from your Netlify function!" }),
//   };
// };

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// app.post("/v1/transaction", (req, res) => {
//   const { transactionId, orderId, amount, transactionStatus } = req.body;
//   let transactionResponse = null;

//   if (!transactionId || !orderId || !amount || !transactionStatus) {
//     return res.status(400).json({
//       error: `There is a missing request body!`,
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
//       .json({ failedDesc: "Transaction denied from Kredivo side" });
//   } else {
//     return res
//       .status(400)
//       .json({ failedDesc: "Status is not settled from Kredivo site" });
//   }

//   res.status(200).json(transactionResponse);
// });

// module.exports = app;
