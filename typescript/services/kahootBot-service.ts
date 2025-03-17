import { FastifyRequest, FastifyReply } from 'fastify';
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
        
        
        req.body.crash = req.body.crash === 'on' || req.body.crash === true;
        if (req.body.amount > 200 || req.body.ttl > 300) {
            reply.status(400).send({error: "amount cant be greater then 200 and ttl cannot be greater then 300 (5m)"});
        }
        
        try {
            const response = await fetch(URL.kahootbot_internal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...req.body
                }),
            });

            
            if (!response.ok) {
                
                const errorDetails = await response.text();
                reply.status(response.status).send({ error: `Failed to start swarm: ${errorDetails}` });
                return;
            }

            
            const responseData = await response.json();
            reply.status(200).send({ success: true, data: responseData });
        } catch (error) {
            // Catch network or other errors
            console.error('Error during external request:', error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
