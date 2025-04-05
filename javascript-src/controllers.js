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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Controllers {
    constructor(utils, server, directory) {
        this.serviceRegistry = new Map(); // Registry of service classes + instances of those classes with number attached to them. for exsample for the classes it finds (servePage: extends FelixHubServiceBase) then the instances starting from 1 (servePage1 servePage2) based on how many times the user uses the same service. 
        this.serviceToIndex = new Map();
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
                    this.serviceRegistry.set(moduleName, ServiceClass);
                    console.log(`Service "${moduleName}" loaded successfully.`);
                }
                catch (error) {
                    console.error(`Failed to load service "${moduleName}":`, error);
                }
            }
        });
    }
    // temp
    registerService(identifier, ServiceClass) {
        let serviceInstance = new ServiceClass();
        serviceInstance.utils = this.utils; // Inject Utils
        serviceInstance.server = this.server; // Inject Fastify
        let constructedIdentifier = identifier;
        let index = 0;
        while (this.serviceRegistry.has(constructedIdentifier)) {
            index += 1;
            constructedIdentifier = `${identifier}${index}`;
        }
        this.serviceRegistry.set(constructedIdentifier, serviceInstance);
        console.log(`regesterd ${constructedIdentifier}`);
        this.serviceToIndex.set(identifier, index);
    }
    getServiceClass(serviceClassName) {
        const serviceClass = this.serviceRegistry.get(serviceClassName);
        if (!serviceClass) {
            console.error(`service class ${serviceClassName} not found please check the service file name.`);
            return null;
        }
        return serviceClass;
    }
    // Get the callback for a specific service
    getServiceCallback(identifier) {
        const service = this.serviceRegistry.get(`${identifier}${this.serviceToIndex.get(identifier)}`);
        if (!service) {
            console.warn(`Service "${identifier}" not found. Ensure it is correctly named and loaded.`);
            return null;
        }
        return service.callBack.bind(service);
    }
    // Set parameters for a specific service
    setServiceParams(identifier, params) {
        const service = this.serviceRegistry.get(`${identifier}${this.serviceToIndex.get(identifier)}`);
        if (!service) {
            console.warn(`Service "${identifier}" not found. Unable to set parameters.`);
            return;
        }
        if (params) {
            service.params = params;
        }
    }
}
exports.default = Controllers;
