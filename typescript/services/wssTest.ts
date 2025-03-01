import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", (message: string) => {
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
