import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import FelixHubServiceBase from './utility/FelixHubServiceBase';
import Utils from './utility/utils/Utils';

// TODO see comment in initialize()
import RootFelixHubServiceBase from './utility/RootFelixHubServiceBase';
import ApiFelixHubServiceBase from './utility/ApiFelixHubServiceBase';

class Controllers {
  private static instance: Controllers; // Singleton instance
  private serviceRegistry: Map<string, Map<string, FelixHubServiceBase>> = new Map(); // Registry of service classes + instances of those classes with number attached to them. for exsample for the classes it finds (servePage: extends FelixHubServiceBase) then the instances starting from 1 (servePage1 servePage2) based on how many times the user uses the same service. 
  private serviceToIndex: Map<string, number> = new Map();
  private serviceToSubdomain: Map<string, string> = new Map();
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

      // TODO make this dynamic and load service bases from utility dir
      this.serviceRegistry.set(RootFelixHubServiceBase.n, new Map<string, FelixHubServiceBase>)
      this.serviceRegistry.set(ApiFelixHubServiceBase.n, new Map<string, FelixHubServiceBase>)
    
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
        
      

        if (!ServiceClass.n) {
          console.warn(`service file "${moduleName}" has no name attribute. Does your class inherit from one of the service class bases? ... skipping`);
          continue;
        }

        let serviceMap = this.serviceRegistry.get(ServiceClass.n)

        if (!serviceMap) {
          console.warn(`service file "${moduleName}" has a name attribute but it does not match any known ServiceBases. Does your class inherit from one of the service class bases? ... skipping`);
          continue;
        }
        
        serviceMap.set(moduleName, ServiceClass)
        this.serviceToSubdomain.set(moduleName, ServiceClass.n);


        console.log(`Service "${moduleName}" loaded successfully.`);
      } catch (error) {
        console.error(`Failed to load service "${moduleName}":`, error);
      }
    }
  }
  // Make scriter 
  public registerService(identifier: string, ServiceClass: any): void {
  
    let serviceInstance: FelixHubServiceBase = new ServiceClass();
    // get the name so we can get the correct registry map
    
    let reg = this.serviceRegistry.get(ServiceClass.n);

    

    if (!reg) {
      console.error(`The registery does not provied name "${ServiceClass.n}" did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`)
      return;
    }

    serviceInstance.utils = this.utils; // Inject Utils
    serviceInstance.server = this.server; // Inject Fastify



    let constructedIdentifier: string = identifier;
    let index = 0;



    while (reg.has(constructedIdentifier)) {
      index += 1;

      constructedIdentifier = `${identifier}${index}` 
    }

    reg.set(constructedIdentifier, serviceInstance);
    console.log(`regesterd ${constructedIdentifier}`);
    this.serviceToIndex.set(identifier, index);
  }

  public getServiceClass(serviceIdentifier: string) {

    let sub = this.serviceToSubdomain.get(serviceIdentifier);

    if (!sub) {
      return;
    }
    let reg = this.serviceRegistry.get(sub);

    if (!reg) {
      console.error(`The registery does not have the provided subdomain. Did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`)
      return;
    }

    let service = reg.get(serviceIdentifier);
    
    if (!service) {
      console.warn(`Service "${serviceIdentifier}" not found. Ensure it is correctly named and loaded.`);
      return;
    }

    return service;

  }

  public getServiceInstance(serviceIdentifier: string): FelixHubServiceBase | void {
    let sub = this.serviceToSubdomain.get(serviceIdentifier);

    if (!sub) {
      return;
    }
    let reg = this.serviceRegistry.get(sub);

    if (!reg) {
      console.error(`The registery does not have the provided subdomain. Did you ovveride name or did you not inherit from a service base. This should have been cought is loadservices so something is wrong with the code in there.`)
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
  public getServiceCallback(serviceInstance: FelixHubServiceBase): ((req: FastifyRequest, reply: FastifyReply) => void) | void {
    

    return serviceInstance.callBack.bind(serviceInstance);
  }

  public getServicePrehandler(serviceInstance: FelixHubServiceBase): ((req: FastifyRequest, reply: FastifyReply) => void) | void {
    

    return serviceInstance.prehandler.bind(serviceInstance);
  }

  // Set parameters for a specific service
  public setServiceParams(serviceInstance: FelixHubServiceBase, params?: any): void {
    if (params) {
      serviceInstance.params = params;
    }
  }
}

export default Controllers;
