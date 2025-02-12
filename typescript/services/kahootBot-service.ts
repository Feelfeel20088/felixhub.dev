import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';
import URL from '../utility/config/URLS';

export default class kahootBotStartSwarm extends FelixHubServiceBase {
    
    // ttl default if not provided is 10
    async callBack(req: FastifyRequest<{
        Body: { 
            amount: number, 
            gamepin: string, 
            nickname: string,
            crash: string | boolean, 
            ttl: number 
        }
    }>, reply: FastifyReply): Promise<void> {
        
        // Handle crash field (converting from 'on' or boolean to true/false)
        req.body.crash = req.body.crash === 'on' || req.body.crash === true;
        console.log(req.body.ttl);
        // Perform the external API request
        try {
            const response = await fetch(URL.kahootbot_local, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...req.body
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                // Log the error and return an appropriate error response
                const errorDetails = await response.text();
                console.error(`Error: ${response.status} - ${errorDetails}`);
                reply.status(response.status).send({ error: `Failed to start swarm: ${errorDetails}` });
                return;
            }

            // If successful, send a success response
            const responseData = await response.json();
            reply.send({ success: true, data: responseData });
        } catch (error) {
            // Catch network or other errors
            console.error('Error during external request:', error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
