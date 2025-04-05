import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs/promises';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';

export default class FelixHubServeQueryService extends FelixHubServiceBase {
    // Override the callback method to implement the service logic
    public async callBack(req: FastifyRequest<{ Params: { projectName: string } }>, reply: FastifyReply): Promise<void> {
        // Ensure params has the folder key
        if (!this.params || !this.params.folder) {
            reply.status(500).send({ error: 'Service parameters are missing or incomplete.' });
            return;
        }

        const folder: string = this.params.folder; // Get folder from params
        const queryName = req.params.projectName;

        // Construct the document path
        const docPath: string = path.join(__dirname, "..", "..", "/static", folder, `${queryName.slice(1)}.html`);
        
        try {
            // Check if the file exists using the utils method
            if (await this.utils.fileExists(docPath)) {
                const data: string = await fs.readFile(docPath, 'utf-8');
                reply.type('text/html').send(data);
            } else {
                console.log(`File not found at: ${docPath}`);
                reply.status(404).send({ error: 'File not found' });
            }
        } catch (error) {
            console.error(`Error while serving query: ${error}`);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
