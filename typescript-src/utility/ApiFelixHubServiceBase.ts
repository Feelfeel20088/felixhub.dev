import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Utils from './utils/Utils'

export default abstract class ApiFelixHubServiceBase {
    static n: string = "ApiFelixHubServiceBase";

    async prehandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        if (request.headers.host !== "api.felixhub.dev") {
            return reply.status(403).send({ error: 'Forbidden: Invalid host' }); // Reject request if host is incorrect
        }
    }
    utils!: Utils; // Instance of Utils, initialized later
    server!: FastifyInstance; // Instance of Fastify, initialized late
    params?: Record<string, any>; // Custom parameters passed to the service
    abstract callBack(req: FastifyRequest, reply: FastifyReply): void;
}
  