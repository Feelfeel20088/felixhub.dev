import { FastifyRequest, FastifyReply } from 'fastify';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';
import URL from '../utility/config/URLS';

export default class KahootBotStartSwarm extends FelixHubServiceBase {
    
    // Default TTL if not provided is 10
    async callBack(req: FastifyRequest<{
        Body: { 
            amount: number, 
            gamepin: string, 
            nickname: string,
            crash: string | boolean, 
            ttl: number 
        }
    }>, reply: FastifyReply): Promise<void> {
        
        // Handle crash field conversion
        const crash = req.body.crash === 'on' || req.body.crash === true;
        const { amount, gamepin, nickname, ttl } = req.body;

        // Validate amount and ttl
        if (amount > 200 || ttl > 300) {
            return reply.status(400).send({ error: "amount can't be greater than 200 and ttl cannot be greater than 300 (5m)" });
        }

        try {
            const response = await fetch(URL.kahootbot_internal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    gamepin,
                    nickname,
                    crash,
                    ttl
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                return reply.status(response.status).send({ error: `Failed to start swarm: ${errorDetails}` });
            }

            const responseData = await response.json();
            reply.send({ success: true, data: responseData });
        } catch (error) {
            console.error('Error during external request:', error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
