"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = __importDefault(require("./controllers"));
const Utils_1 = __importDefault(require("./utility/utils/Utils"));
class FelixHub {
    constructor(server) {
        this.server = server;
        this.controllers = controllers_1.default.getInstance(Utils_1.default.getInstance(), server);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.controllers.initialize();
        });
    }
    getService(params, service) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set parameters for the specified service
            let serviceClass = this.controllers.getServiceClass(service);
            if (!serviceClass) {
                throw new Error(`server class ${service} not found`);
            }
            this.controllers.registerService(service, serviceClass);
            this.controllers.setServiceParams(service, params);
            // Retrieve the bound callback for the service
            const callBack = this.controllers.getServiceCallback(service);
            if (!callBack) {
                throw new Error(`Service instance ${service} not found or does not provide a valid callback.`);
            }
            return callBack;
        });
    }
    /**
     * Define a route dynamically and link it to a service.
     * @param method - HTTP method for the route (GET, POST, etc.)
     * @param url - URL path for the route
     * @param params - Parameters to pass to the service
     * @param service - The name of the service to link the route to
     */
    route(method, url, params, service) {
        return __awaiter(this, void 0, void 0, function* () {
            // Register the route with Fastify
            const callBack = yield this.getService(params, service);
            this.server.route({
                method,
                url,
                handler: callBack,
            });
        });
    }
    // ------------------------
    //        wrappers 
    // ------------------------
    setNotFoundHandler(params, service) {
        return __awaiter(this, void 0, void 0, function* () {
            const callBack = yield this.getService(params, service);
            this.server.setNotFoundHandler(callBack);
        });
    }
}
exports.default = FelixHub;
