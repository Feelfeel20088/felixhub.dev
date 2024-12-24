import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import * as path from 'path'; 
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import favicon from 'fastify-favicon';

interface ChatRequest {
    content: string,
    images: [String]
}

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

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

export {server}