"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// TODO see comment in initialize()
const RootFelixHubServiceBase_1 = __importDefault(require("./utility/RootFelixHubServiceBase"));
const ApiFelixHubServiceBase_1 = __importDefault(require("./utility/ApiFelixHubServiceBase"));
class Controllers {
    constructor(utils, server, directory) {
        this.serviceRegistry = new Map(); // Registry of service classes + instances of those classes with number attached to them. for exsample for the classes it finds (servePage: extends FelixHubServiceBase) then the instances starting from 1 (servePage1 servePage2) based on how many times the user uses the same service. 
        this.serviceToIndex = new Map();
        this.serviceToSubdomain = new Map();
        this.utils = utils;
        this.server = server;
        this.directory = directory || './services'; // Default directory if not provided
    }
    // Get the singleton instance
    static getInstance(utils, server, directory = './services') {
        if (!Controllers.instance) {
            Controllers.instance = new Controllers(utils, server, directory);
        }
        return Controllers.instance;
    }
    // Initialize and load all services
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Initializing controllers...');
            try {
                // TODO make this dynamic and load service bases from utility dir
                this.serviceRegistry.set(RootFelixHubServiceBase_1.default.n, new Map);
                this.serviceRegistry.set(ApiFelixHubServiceBase_1.default.n, new Map);
                yield this.loadServices();
            }
            catch (error) {
                console.error('Error(s) during initialization:', error);
            }
        });
    }
    // Dynamically load services
    loadServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const servicesDirectory = path.resolve(__dirname, this.directory);
            if (!fs.existsSync(servicesDirectory)) {
                console.warn(`Services directory "${this.directory}" does not exist.`);
                return;
            }
            const files = fs.readdirSync(servicesDirectory);
            for (const file of files) {
                const filePath = path.join(servicesDirectory, file);
                // Ignore non-JS/TS files
                console.log(file);
                if (!file.endsWith('.js')) {
                    console.warn(`Skipping non-JS file: ${file}`);
                    continue;
                }
                const moduleName = path.basename(file, path.extname(file)); // Extract the service name
                try {
                    console.log(`Attempting to import: ${filePath}`);
                    const ServiceClass = (yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).default;
                    if (!ServiceClass) {
                        console.warn(`service file "${moduleName}" has no default export... skipping`);
                        continue;
                    }
                    if (!ServiceClass.n) {
                        console.warn(`service file "${moduleName}" has no name attribute. Does your class inherit from one of the service class bases? ... skipping`);
                        continue;
                    }
                    let serviceMap = this.serviceRegistry.get(ServiceClass.n);
                    if (!serviceMap) {
                        console.warn(`service file "${moduleName}" has a name attribute but it does not match any known ServiceBases. Does your class inherit from one of the service class bases? ... skipping`);
                        continue;
                    }
                    serviceMap.set(moduleName, ServiceClass);
                    this.serviceToSubdomain.set(moduleName, ServiceClass.n);
                    console.log(`Service "${moduleName}" loaded successfully.`);
                }
                catch (error) {
                    console.error(`Failed to load service "${moduleName}":`, error);
                }
            }
        });
    }
    // Make scriter 
    registerService(identifier, ServiceClass) {
        let serviceInstance = new ServiceClass();
        // get the name so we can get the correct registry map
        let reg = this.serviceRegistry.get(ServiceClass.n);
        if (!reg) {
            console.error(`The registery does not provied name "${ServiceClass.n}" did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`);
            return;
        }
        serviceInstance.utils = this.utils; // Inject Utils
        serviceInstance.server = this.server; // Inject Fastify
        let constructedIdentifier = identifier;
        let index = 0;
        while (reg.has(constructedIdentifier)) {
            index += 1;
            constructedIdentifier = `${identifier}${index}`;
        }
        reg.set(constructedIdentifier, serviceInstance);
        console.log(`regesterd ${constructedIdentifier}`);
        this.serviceToIndex.set(identifier, index);
    }
    getServiceClass(serviceIdentifier) {
        let sub = this.serviceToSubdomain.get(serviceIdentifier);
        if (!sub) {
            return;
        }
        let reg = this.serviceRegistry.get(sub);
        if (!reg) {
            console.error(`The registery does not have the provided subdomain. Did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`);
            return;
        }
        let service = reg.get(serviceIdentifier);
        if (!service) {
            console.warn(`Service "${serviceIdentifier}" not found. Ensure it is correctly named and loaded.`);
            return;
        }
        return service;
    }
    getServiceInstance(serviceIdentifier) {
        let sub = this.serviceToSubdomain.get(serviceIdentifier);
        if (!sub) {
            return;
        }
        let reg = this.serviceRegistry.get(sub);
        if (!reg) {
            console.error(`The registery does not have the provided subdomain. Did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`);
            return;
        }
        let service = reg.get(`${serviceIdentifier}${this.serviceToIndex.get(serviceIdentifier)}`);
        if (!service) {
            console.warn(`Service "${serviceIdentifier}" not found. Ensure it is correctly named and loaded.`);
            return;
        }
        return service;
    }
    // Get the callback for a specific service
    getServiceCallback(serviceInstance) {
        return serviceInstance.callBack.bind(serviceInstance);
    }
    getServicePrehandler(serviceInstance) {
        return serviceInstance.prehandler.bind(serviceInstance);
    }
    // Set parameters for a specific service
    setServiceParams(serviceInstance, params) {
        if (params) {
            serviceInstance.params = params;
        }
    }
}
exports.default = Controllers;
