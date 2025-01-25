import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Utils from './utils/Utils'

export default abstract class FelixHubServiceBase {
    utils!: Utils; // Instance of Utils, initialized later
    server!: FastifyInstance; // Instance of Fastify, initialized late
    params?: Record<string, any>; // Custom parameters passed to the service
    abstract callBack(req: FastifyRequest, reply: FastifyReply): void;
}

 // method!: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Restrict to HTTP methods
    // url!: string; // URL for the route
  
    // Abstract method to be implemented by services