// server/index.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(data) {
    console.log("Received:", data.toString());
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("WebSocket server listening on ws://localhost:5000");
});
