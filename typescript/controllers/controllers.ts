import { FastifyRequest, FastifyReply } from 'fastify';

interface Controller {
  wrapRoute<Body, Params, Query>(
    controllerLambda: (
      request: FastifyRequest<{ Body: Body; Params: Params; Querystring: Query }>,
      reply: FastifyReply
    ) => Promise<void>
  ): (
    request: FastifyRequest<{ Body: Body; Params: Params; Querystring: Query }>,
    reply: FastifyReply
  ) => Promise<void>;
}

class Controllers implements Controller {
  public static instance: Controllers;
//   private utils = 
  private constructor() {}

  public static getInstance(): Controllers {
    if (!Controllers.instance) {
      Controllers.instance = new Controllers();
    }
    return Controllers.instance;
  }
  // forgive me god
  public wrapRoute<Body, Params, Query>(
    controllerLambda: (
      request: FastifyRequest<{ Body: Body; Params: Params; Querystring: Query }>,
      reply: FastifyReply
    ) => Promise<void>
  ): (
    request: FastifyRequest<{ Body: Body; Params: Params; Querystring: Query }>,
    reply: FastifyReply
  ) => Promise<void> {
    return async (request, reply) => {
      try {
        await controllerLambda(request, reply);
      } catch (err) {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    };
  }
}

export default Controllers;
