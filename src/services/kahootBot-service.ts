import { FastifyReply, FastifyRequest } from 'fastify';
import URL from '../utility/config/URLS';
import RootFelixHubServiceBase from '../utility/RootFelixHubServiceBase';


export default class kahootBotStartSwarm extends RootFelixHubServiceBase {

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
            reply.status(400).send({ error: "amount cant be greater then 200 and ttl cannot be greater then 300 (5m)" });
        }

        const index = req.body.gamepin.indexOf("pin=")

        let gamepin: string = ""
        if (req.body.gamepin.indexOf("pin=") !== -1) {
            for (let i = index + 4; !isNaN(Number(req.body.gamepin[i])); i++) {
                gamepin += req.body.gamepin[i]
            }
            req.body.gamepin = gamepin

        }

        try {
            const response = await fetch(URL.kahootbot_internal + "/swarm/createSwarm", {
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
            return;
        } catch (error) {
            // Catch network or other errors
            console.error('Error during external request:', error);
            reply.status(500).send({ error: 'Internal Server Error' });
            return;
        }
    }
}
