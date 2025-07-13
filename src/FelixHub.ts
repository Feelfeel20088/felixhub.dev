import { FastifyInstance, RouteOptions } from "fastify";
import Controllers from "./controllers";
import Utils from "./utility/utils/Utils";
import { error } from "console";
import FelixHubServiceBase from "./utility/RootFelixHubServiceBase";

export default class FelixHub {
    server: FastifyInstance;
    controllers: Controllers;

    constructor(server: FastifyInstance) {
        this.server = server;
        this.controllers = Controllers.getInstance(Utils.getInstance(), server);
    }

    async initialize() {
        await this.controllers.initialize();
    }

    private async getService(params: any, service: string) {

        // Set parameters for the specified service
        const serviceClass = this.controllers.getServiceClass(service);
        if (!serviceClass) {
            throw new Error(`server class ${service} not found`);
        } 
        console.log("serveice: ", service, "sub: ", serviceClass.n)
        this.controllers.registerService(service, serviceClass);
        const serviceInstance = this.controllers.getServiceInstance(service);
        if (!serviceInstance) {
            throw new Error(`server instance was not found. try calling instanceofcontroller.registerService(service, serviceClass)`)
        }
        this.controllers.setServiceParams(serviceInstance, params);

        // Retrieve the bound callback for the service
        const callBack = this.controllers.getServiceCallback(serviceInstance);
        const prehandler = this.controllers.getServicePrehandler(serviceInstance)

        if (!callBack) {
            throw new Error(`Service instance ${service} not found or does not provide a valid callback.`);
        }

        if (!prehandler) {
            throw new Error(`Service instance ${service} does not provide a valid prehandler.`);
        }

        return { callBack, prehandler };

    }

    /**
     * Define a route dynamically and link it to a service.
     * @param method - HTTP method for the route (GET, POST, etc.)
     * @param url - URL path for the route
     * @param params - Parameters to pass to the service
     * @param service - The name of the service to link the route to
     */
    async route(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        url: string,
        params: any,
        service: string
    ): Promise<void> {
        // Register the route with Fastify
        const { callBack, prehandler } = await this.getService(params, service);
        
        
        this.server.route({
            method,
            url,
            handler: callBack,
            preHandler: prehandler
        } as RouteOptions);
    }


    // ------------------------
    //        wrappers 
    // ------------------------
    async setNotFoundHandler(params: any, service: string) {
        const { callBack, prehandler } = await this.getService(params, service); 
        this.server.setNotFoundHandler(callBack);
    }

    // async setErrorHandler(params: any, service: string) {
    //     const callBack = await this.getService(params, service);
    //     this.server.setErrorHandler(callBack);
    // }
}
