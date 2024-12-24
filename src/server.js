"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const server = (0, fastify_1.default)({
    logger: true,
    bodyLimit: 1048576000 // Global limit (1 MB)
});
server.register(static_1.default, {
    root: path.resolve(__dirname)
});
server.register(formbody_1.default);
server.register(require('@fastify/helmet'), {
    contentSecurityPolicy: false // Disables the Content Security Policy
});
server.register(require('fastify-favicon'), { path: path.join(__dirname, 'static', 'images'), name: 'favicon.ico', maxAge: 3600 });
server.get('/signup', async (request, reply) => {
    try {
        const data = await fs_1.promises.readFile(path.join(__dirname, 'static', 'signup.html'), "utf-8");
        reply.type('text/html').send(data);
    }
    catch (err) {
        server.log.error('Error reading file:', err);
        reply.status(500).send('Error reading the HTML file');
    }
});
server.get('/', async (request, reply) => {
    try {
        const data = await fs_1.promises.readFile(path.join(__dirname, 'static', 'home.html'), "utf-8");
        reply.type('text/html').send(data);
    }
    catch (err) {
        server.log.error('Error reading file:');
        reply.status(500).send('Error reading the HTML file');
    }
});
server.get('/index', async (request, reply) => {
    try {
        const data = await fs_1.promises.readFile(path.join(__dirname, 'static', 'index.html'), "utf-8");
        reply.type('text/html').send(data);
    }
    catch (err) {
        server.log.error('Error reading file:');
        reply.status(500).send('Error reading the HTML file');
    }
});
server.get('/AIpage', async (request, reply) => {
    console.log("making AI request");
    try {
        const data = await fs_1.promises.readFile(path.join(__dirname, 'static', 'AI.html'), "utf-8");
        reply.type('text/html').status(200).send(data);
    }
    catch (err) {
        server.log.error('Error reading file:', err);
        reply.status(500).send('Error reading the HTML file');
    }
});
server.post('/chat', async (request, reply) => {
    console.log(JSON.stringify({
        model: 'llava',
        messages: [
            {
                role: 'user',
                ...request.body
            }
        ]
    }));
    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llava',
                messages: [
                    {
                        role: 'user',
                        ...request.body
                    }
                ]
            })
        });
        if (!response.ok) {
            server.log.error('Error getting AI response reason: ' + response.statusText);
            reply.status(500).send({ error: 'Error getting AI response' });
            return;
        }
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
            server.log.error('No reader available for response body');
            reply.status(500).send({ error: 'No data in the response' });
            return;
        }
        reply.type('application/json');
        while (true) {
            const { done, value } = await reader.read();
            const bufferedData = decoder.decode(value, { stream: true });
            console.log(bufferedData);
            if (done) {
                console.log("done on loop");
                reply.raw.end();
                return;
            }
            reply.raw.write(value);
        }
    }
    catch (error) {
        server.log.error(`Fetch error: ${error}`);
        reply.status(500).send({ error: 'Internal server error' });
    }
});
// TODO add database
// server.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
//     request.body as SignupRequestBody;
//     if (Utility.isPriv(request.body.username, request.body.password))
// });
// Start the server
server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
