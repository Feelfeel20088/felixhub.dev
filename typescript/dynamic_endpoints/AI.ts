import { server } from '../fastify'; // Use relative path './' for files in the same directory
import { FastifyRequest, FastifyReply } from 'fastify';
import { ChatRequest } from '../utility/interfaces';




server.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
    // check for auth here again
    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llava', 
                messages: [
                    {
                    role: 'user',
                    ...request.body as ChatRequest
                    }
                ]
            })
        });

        if (!response.ok) {
            server.log.error('Error getting AI response reason: ' + response.statusText);
            reply.status(500).send({ error: 'Error getting AI response' });
            return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            server.log.error('No reader available for response body');
            reply.status(500).send({ error: 'No data in the response' });
            return;
        }
        reply.type('application/json');

        while (true) {
            const { done, value } = await reader.read();
            const bufferedData = decoder.decode(value, { stream: true });
            console.log(bufferedData);
            if (done) {

                console.log("done on loop");
                reply.raw.end();
                return;
            }
            reply.raw.write(value);
        }
    } catch (error) {
        server.log.error(`Fetch error: ${error}`);
        reply.status(500).send({ error: 'Internal server error' });
    }
});