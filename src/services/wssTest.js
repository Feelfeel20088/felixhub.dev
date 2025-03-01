"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
        console.log("Received:", message);
        ws.send(`Echo: ${message}`); // Send the same message back
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});
console.log("WebSocket server running on ws://localhost:8080");
