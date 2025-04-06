"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const fastify_favicon_1 = __importDefault(require("fastify-favicon"));
const FelixHub_1 = __importDefault(require("./FelixHub"));
const server = (0, fastify_1.default)({
    logger: true,
    bodyLimit: 1048576000 // Global limit (1 MB)
});
server.register(static_1.default, {
    root: path_1.default.resolve(__dirname, "..")
});
server.register(formbody_1.default);
server.register(helmet_1.default, {
    contentSecurityPolicy: false
});
server.register(fastify_favicon_1.default, {
    path: path_1.default.join(__dirname, '..', 'static', 'images'),
    name: 'favicon.ico',
    maxAge: 3600
});
server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`Server is now listening on ${address}`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    let felixhub = new FelixHub_1.default(server);
    yield felixhub.initialize(); // Wait for async initialization
    yield felixhub.route("GET", "/", { fileName: "index.html" }, "servePage");
    yield felixhub.route("GET", "/about", { fileName: "home.html" }, "servePage");
    yield felixhub.route("GET", "/AIpage", { fileName: "AI.html" }, "servePage");
    yield felixhub.route("GET", "/signup", { fileName: "signup.html" }, "servePage");
    yield felixhub.route("GET", "/projects", { fileName: "projects.html" }, "servePage");
    yield felixhub.route("GET", "/admin", { fileName: "admin.html" }, "servePage");
    yield felixhub.route("GET", "/Just_Another_Kahootbot:projectName", { folder: "../static/documentation/Just_Another_Kahootbot" }, "serveQuary");
    yield felixhub.route("POST", "/chat", null, "AI-service");
    yield felixhub.route("POST", "/kahootswarm", null, "kahootBot-service");
    yield felixhub.setNotFoundHandler({ fileName: "404notfound.html" }, "servePage");
}))();
// Create WebSocket server
// const wss = new WebSocketServer({ port: 9111 });
// console.log('WebSocket server is running on ws://localhost:8080');
// wss.on('connection', (ws) => {
//     console.log('New client connected');
//     ws.on('message', (message: WebSocket.RawData) => {
//         console.log(message.toString());
//     });
//         let bufferMessage;
//         // if (message instanceof ArrayBuffer) {
//         //     bufferMessage = Buffer.from(message);
//         // } else {
//         //     bufferMessage = message as Buffer;
//         // }
//         // // Write the buffer to a file
//         // fs.writeFile('/home/felix/projects/webserver/src/static/images/output.jpg', bufferMessage, (err) => {
//         //     if (err) {
//         //         console.error('Error writing to file', err);
//         //     } else {
//         //         console.log('Data has been written to output.jpg');
//         //     }
//         // });
//         // // Read image as a Buffer
//         // // const imageBuffer = fs.readFileSync("/home/felix/projects/webserver/src/static/images/mitch.jpg");
//         // // Create the command object with a signal or identifier, without the image itself
//         // const command = {
//         //     command: "Xspy-INIT",
//         //     value: "ee"
//         // };
//         // ws.send(JSON.stringify(command));
//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
//     ws.on('error', (err) => {
//         console.error(`WebSocket error: ${err.message}`);
//     });
// });
