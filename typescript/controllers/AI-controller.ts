import { FastifyRequest, FastifyReply } from 'fastify';
import ChatRequest from '../utility/chat-request-interface';
import URL from '../utility/config/URL';

export const handleChatRequest = async (request: FastifyRequest<{Body: ChatRequest}>, reply: FastifyReply) => {
    // Check for auth here if necessary

    console.log("User request:");
    console.log(request.body);
    console.log("Fetching from Ollama API...");

    try {
        const response = await fetch(URL.ollama_internal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llava',
                messages: [
                    {
                        role: 'user',
                        ...request.body
                    }
                ]
            })
        });
        if (!response.ok) {
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

        while (true) {
            const { done, value } = await reader.read();
            const bufferedData = decoder.decode(value, { stream: true });
            console.log(bufferedData);
            console.log(value)

            if (done) {
                console.log("Done reading response");
                reply.raw.end();
                return;
            }
            reply.raw.write(value);
        }
    } catch (error) {
        console.error(`Fetch error: ${error}`);
        reply.status(500).send({ error: 'Internal server error' });
    }
};
