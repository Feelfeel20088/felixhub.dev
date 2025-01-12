"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AI_controller_1 = require("../controllers/AI-controller");
const pageController_1 = require("../controllers/pageController");
const serveQuary_controller_1 = require("../controllers/serveQuary-controller");
const chatRoutes = (server) => {
    server.post('/chat', AI_controller_1.handleChatRequest);
    server.get('/signup', (0, pageController_1.servePage)('signup.html'));
    // Route for /about
    server.get('/about', (0, pageController_1.servePage)('home.html'));
    // Route for /
    server.get('/', (0, pageController_1.servePage)('index.html'));
    // Route for /AIpage
    server.get('/AIpage', (0, pageController_1.servePage)('AI.html'));
    server.get('/projects', (0, pageController_1.servePage)('projects.html'));
    server.get('/projects:projectName', (0, serveQuary_controller_1.serve_Quary)('documentation/KahootBot'));
    // this page is shitty may want to update it
    server.setNotFoundHandler((0, pageController_1.servePage)('404notfound.html'));
};
exports.default = chatRoutes;
