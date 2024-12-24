import { server } from './fastify'; // Use relative path './' for files in the same directory
import { FastifyRequest, FastifyReply } from 'fastify';
import { promises as fs } from 'fs';
import * as path from 'path'; 


server.get('/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const data: string = await fs.readFile(path.join(__dirname, 'static', 'signup.html'), "utf-8");
        reply.type('text/html').send(data);
    } catch (err) {
        server.log.error('Error reading file:', err);
        reply.status(500).send('Error reading the HTML file');
    }
});
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {

    try {
        const data: string = await fs.readFile(path.join(__dirname, 'static', 'home.html'), "utf-8");
        reply.type('text/html').send(data);
    } catch (err) {
        server.log.error('Error reading file:');
        reply.status(500).send('Error reading the HTML file');
    }
});

server.get('/index', async (request: FastifyRequest, reply: FastifyReply) => {

    try {
        const data: string = await fs.readFile(path.join(__dirname, 'static', 'index.html'), "utf-8");
        reply.type('text/html').send(data);
    } catch (err) {
        server.log.error('Error reading file:');
        reply.status(500).send('Error reading the HTML file');
    }
});

server.get('/AIpage', async (request: FastifyRequest, reply: FastifyReply) => {
    // set auth later
    try {
        const data: string = await fs.readFile(path.join(__dirname, 'static', 'AI.html'), "utf-8");
        reply.type('text/html').status(200).send(data);
    } catch (err) {
        server.log.error('Error reading file:', err);
        reply.status(500).send('Error reading the HTML file');
    }
});