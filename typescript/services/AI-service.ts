import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import FelixHubServiceBase from '../utility/FelixHubServiceBase';
import URL from '../utility/config/URL';

export default class FelixHubChatService extends FelixHubServiceBase {
    // Define the callback method for the service
    public async callBack(req: FastifyRequest<{ Body: { model: string; content: string; images: string[];} }>, reply: FastifyReply): Promise<void> {
        const { model } = req.body
        delete (req as any).body.model; // just to make sure i dont have to set model as optianl
        try {
            // Make a POST request to the Ollama API
            const response = await fetch(URL.ollama_external, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            ...req.body,
                        },
                    ],
                }),
            });

            // Handle errors in the API response
            if (!response.ok) {
                console.warn(`something went wrong with ollama :( ${await response.text()}`)
                reply.status(500).send({ error: 'Error getting AI response' });
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                reply.status(500).send({ error: 'No data in the response' });
                return;
            }

            reply.type('application/json');

            // Stream the data from the response to the client
            while (true) {
                const { done, value } = await reader.read();
                const bufferedData = decoder.decode(value, { stream: true });

                if (done) {
                    console.log('Done reading response');
                    reply.raw.end();
                    return;
                }

                reply.raw.write(value);
            }
        } catch (error) {
            // Handle internal server errors
            console.error(`Fetch error: ${error}`);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
