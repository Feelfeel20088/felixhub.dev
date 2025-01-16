import {FastifyRequest, FastifyReply} from "fastify";


interface Controller {
    wrapRoute(
        controllerLambda: (request: FastifyRequest, reply: FastifyReply, instance: Controllers) => Promise<void>
    ): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
class Controllers implements Controller {
    public static instance: Controllers;

    private constructor() {}

    public static getInstance(): Controllers {
        if (!Controllers.instance) {
          Controllers.instance = new Controllers();
        }
        return Controllers.instance;
    }

    public wrapRoute(
        controllerLambda: (request: FastifyRequest, reply: FastifyReply, instance: Controllers) => Promise<void>
    ): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
        return async (request, reply) => {
            controllerLambda(request, reply, this)
            
        };
    }
}

export default Controllers;