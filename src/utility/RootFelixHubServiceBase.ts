import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Utils from './utils/Utils'

export default abstract class RootFelixHubServiceBase {
    static n: string = "RootFelixHubServiceBase";
    async prehandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {return}; // do nothing non restricted route
    utils!: Utils; // Instance of Utils, initialized later
    server!: FastifyInstance; // Instance of Fastify, initialized late
    params?: Record<string, any>; // Custom parameters passed to the service
    abstract callBack(req: FastifyRequest, reply: FastifyReply): void;
}
  