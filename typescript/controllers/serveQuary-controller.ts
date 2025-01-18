import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path'
import fs from 'fs/promises';
import projects from '../utility/param-interface';
import { fileExists } from '../utility/fileExists';

export const servequary = (folder: string) => {
    return async (request: FastifyRequest<{Params: projects}>, reply: FastifyReply) => {
        const Quaryname = request.params.projectName;
        
        const docPath: string = path.join(__dirname, '../static', folder, `${Quaryname.slice(1)}.html`)

        // Check if the file exists
        if (await fileExists(docPath)) {
            const data: string = await fs.readFile(docPath, 'utf-8');
            reply.type('text/html').send(data);
        } else {
            console.log(docPath);
            reply.status(404);
        }
    };
};

