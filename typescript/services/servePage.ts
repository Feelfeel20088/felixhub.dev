import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';

export default class ServePageService extends FelixHubServiceBase {
    // Implements the callback to handle the route logic

    async callBack(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        const fileName = this.params?.fileName; // Retrieve the fileName from params
        console.log(fileName)
        if (!fileName) {
            reply.status(400).send('Missing fileName parameter');
            return;
        }

        try {
            // Read the specified HTML file
            const filePath = path.join(__dirname, '../static', fileName);
            const data: string = await fs.readFile(filePath, 'utf-8');
            reply.type('text/html').send(data); // Serve the HTML content
        } catch (err) {
            reply.status(500).send('Error reading the HTML file');
        }
    }
}
