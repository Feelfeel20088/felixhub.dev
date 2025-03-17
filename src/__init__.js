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
