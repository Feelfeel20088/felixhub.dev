import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { rootCertificates } from 'tls';
import RootFelixHubServiceBase from '../utility/RootFelixHubServiceBase';

export default class ServePageService extends RootFelixHubServiceBase {

    async callBack(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        const fileName = this.params?.fileName;
        console.log(fileName)
        if (!fileName) {
            reply.status(400).send('Missing fileName parameter');
            return;
        }

        try {
            const filePath = path.join(__dirname, "..", "..", "static", fileName);
            const data: string = await fs.readFile(filePath, "utf-8");
            reply.type("text/html").send(data); 
        } catch (err) {
            reply.status(500).send("Error reading the HTML file");
        }
    }
}
