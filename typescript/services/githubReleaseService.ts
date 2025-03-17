import { FastifyRequest, FastifyReply } from 'fastify';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';
import dotenv from 'dotenv';

dotenv.config({ path: '../secrets/.env' });

export default class GithubProjectGetter extends FelixHubServiceBase {
    private token = process.env.GITHUB_TOKEN;

    
    async callBack(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        
        // const response = await fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`, {
        //     headers: {
        //         'Authorization': `token ${this.token}`
        //     }
        // });

        const response = await fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`);

        reply.status(200).send(await response.json());
    }
}
