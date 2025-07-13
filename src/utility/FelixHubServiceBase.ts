import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Utils from './utils/Utils'
export default interface FelixHubServiceBase {
    n: string;
    prehandler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    utils?: Utils; // Optional, will be initialized later
    server?: FastifyInstance; // Optional, will be initialized later
    params?: Record<string, any>; // Custom parameters passed to the service

    // Define the abstract method signature in the interface
    callBack(req: FastifyRequest, reply: FastifyReply): void;
}