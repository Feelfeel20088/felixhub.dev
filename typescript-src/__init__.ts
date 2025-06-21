import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import path from 'path';
import FelixHub from "./FelixHub";



const server = fastify({
    logger: true,
    bodyLimit: 1048576000 // Global limit (1 MB)
});

server.register(fastifyStatic, {
    root: path.resolve(__dirname, "..")
});

server.register(formbody);

server.register(helmet, {
    contentSecurityPolicy: false
});

server.register(favicon, {
    path: path.join(__dirname, '..', 'static', 'images'),
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
    await felixhub.route("GET", "/admin", { fileName: "admin.html" }, "servePage");
    await felixhub.route("GET", "/games", { fileName: "games.html" }, "servePage");
    await felixhub.route("GET", "/Just_Another_Kahootbot:projectName", { folder: "../static/documentation/Just_Another_Kahootbot" }, "serveQuary");
    await felixhub.route("POST", "/chat", null, "AI-service");
    await felixhub.route("POST", "/kahootswarm", null, "kahootBot-service");
    await felixhub.setNotFoundHandler({ fileName: "404notfound.html" }, "servePage");
    

    

})();



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
