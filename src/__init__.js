"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes/routes"));
const fastify_1 = __importDefault(require("fastify"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const fastify_favicon_1 = __importDefault(require("fastify-favicon"));
const server = (0, fastify_1.default)({
    logger: true,
    bodyLimit: 1048576000 // Global limit (1 MB)
});
server.register(static_1.default, {
    root: path_1.default.resolve(__dirname)
});
server.register(formbody_1.default);
server.register(helmet_1.default, {
    contentSecurityPolicy: false // Disables the Content Security Policy
});
server.register(fastify_favicon_1.default, {
    path: path_1.default.join(__dirname, 'static', 'images'),
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
(0, routes_1.default)(server);
