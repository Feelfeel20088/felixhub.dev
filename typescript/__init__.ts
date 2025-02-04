import fastify from 'fastify';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import path from 'path';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import favicon from 'fastify-favicon';
import FelixHub from "./FelixHub";



const server = fastify({
    logger: true,
    bodyLimit: 1048576000 // Global limit (1 MB)
});

server.register(fastifyStatic, {
    root: path.resolve(__dirname)
});

server.register(formbody);

server.register(helmet, {
    contentSecurityPolicy: false // Disables the Content Security Policy
});

server.register(favicon, {
    path: path.join(__dirname, 'static', 'images'),
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
(async () => {
    let felixhub = new FelixHub(server);

    await felixhub.initialize(); // Wait for async initialization
    await felixhub.route("GET", "/", { fileName: "index.html" }, "servePage");
    await felixhub.route("GET", "/about", { fileName: "home.html" }, "servePage");
    await felixhub.route("GET", "/AIpage", { fileName: "AI.html" }, "servePage");
    await felixhub.route("GET", "/signup", { fileName: "signup.html" }, "servePage");
    await felixhub.route("GET", "/projects", { fileName: "projects.html" }, "servePage");
    await felixhub.route("GET", "/projects:projectName", { folder: "../static/documentation/KahootBot" }, "serveQuary");
    await felixhub.route("POST", "/chat", null, "AI-service");
    await felixhub.setNotFoundHandler({ fileName: "404notfound.html" }, "servePage");
    

})();