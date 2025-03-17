import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import FelixHubServiceBase from './utility/FelixHubServiceBase';
import Utils from './utility/utils/Utils';

class Controllers {
  private static instance: Controllers; // Singleton instance
  private serviceRegistry: Map<string, FelixHubServiceBase> = new Map(); // Registry of service classes + instances of those classes with number attached to them. for exsample for the classes it finds (servePage: extends FelixHubServiceBase) then the instances starting from 1 (servePage1 servePage2) based on how many times the user uses the same service. 
  private serviceToIndex: Map<string, number> = new Map();
  private directory: string; // Directory for loading services
  private utils: Utils; // Utils instance
  private server: FastifyInstance; // Fastify instance

  private constructor(utils: Utils, server: FastifyInstance, directory: string) {
    this.utils = utils;
    this.server = server;
    this.directory = directory || './services'; // Default directory if not provided
  }

  // Get the singleton instance
  public static getInstance(utils: Utils, server: FastifyInstance, directory: string = './services'): Controllers {
    if (!Controllers.instance) {
      Controllers.instance = new Controllers(utils, server, directory);
    }
    return Controllers.instance;
  }

  // Initialize and load all services
  public async initialize(): Promise<void> {
    console.log('Initializing controllers...');
    try {
      await this.loadServices();
    } catch (error) {
      console.error('Error(s) during initialization:', error);
    }
  }

  // Dynamically load services
  private async loadServices(): Promise<void> {
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
        const ServiceClass = (await import(filePath)).default;
        if (!ServiceClass) {
          console.warn(`service file "${moduleName}" has no default export... skipping`);
          continue;
        }


        this.serviceRegistry.set(moduleName, ServiceClass);
        console.log(`Service "${moduleName}" loaded successfully.`);
      } catch (error) {
        console.error(`Failed to load service "${moduleName}":`, error);
      }
    }
  }
  // temp
  public registerService(identifier: string, ServiceClass: any): void {

    let serviceInstance: FelixHubServiceBase = new ServiceClass();
    serviceInstance.utils = this.utils; // Inject Utils
    serviceInstance.server = this.server; // Inject Fastify


    let constructedIdentifier: string = identifier;
    let index = 0;



    while (this.serviceRegistry.has(constructedIdentifier)) {
      index += 1;

      constructedIdentifier = `${identifier}${index}` 
    }

    this.serviceRegistry.set(constructedIdentifier, serviceInstance);
    console.log(`regesterd ${constructedIdentifier}`);
    this.serviceToIndex.set(identifier, index);
  }

  public getServiceClass(serviceClassName: string): FelixHubServiceBase | null {
    const serviceClass = this.serviceRegistry.get(serviceClassName);
    if (!serviceClass) {
      console.error(`service class ${serviceClassName} not found please check the service file name.`)
      return null
    }
    return serviceClass;

  }

  // Get the callback for a specific service
  public getServiceCallback(identifier: string): ((req: FastifyRequest, reply: FastifyReply) => void) | null {
    const service = this.serviceRegistry.get(`${identifier}${this.serviceToIndex.get(identifier)}`);
    if (!service) {
      console.warn(`Service "${identifier}" not found. Ensure it is correctly named and loaded.`);
      return null;
    }
    return service.callBack.bind(service);
  }

  // Set parameters for a specific service
  public setServiceParams(identifier: string, params?: any): void {
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

export default Controllers;
