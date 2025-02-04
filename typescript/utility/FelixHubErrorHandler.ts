import { FastifyRequest, FastifyReply, FastifyError, FastifyInstance } from 'fastify';
import Utils from './utils/Utils'

export default abstract class FelixHubErrorHandler  {
    utils!: Utils; // Instance of Utils, initialized later
    server!: FastifyInstance; // Instance of Fastify, initialized late
    params?: Record<string, any>; // Custom parameters passed to the service
    abstract callBack(err: FastifyError, req: FastifyRequest, reply: FastifyReply): void;
}