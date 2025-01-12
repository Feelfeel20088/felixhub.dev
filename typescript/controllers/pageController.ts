// controllers/pageController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs/promises';
import path from 'path';

// Controller function to serve an HTML page
export const servePage = (fileName: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const data: string = await fs.readFile(path.join(__dirname, '../static', fileName), 'utf-8');
            reply.type('text/html').send(data);
        } catch (err) {
            reply.status(500).send('Error reading the HTML file');
        }
    };
};
