import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import RootFelixHubServiceBase from '../utility/RootFelixHubServiceBase';

export default class ServePageService extends RootFelixHubServiceBase {
    async callBack(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        const fileName = this.params?.fileName;
        const code = this.params?.code ?? 200;

        try {
            const filePath = path.join(__dirname, "..", "..", "static", fileName);
            const data: string = await fs.readFile(filePath, "utf-8");

            reply
                .type("text/html")
                .status(code)
                .send(data);
        } catch (err) {
            reply.status(500).send("Error reading the HTML file");
        }
    }
}
