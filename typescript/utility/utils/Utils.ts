import fs from 'fs/promises';



export default class Utils {
    private static instance: Utils;
    
    constructor() {};

    public static getInstance(): Utils {
        if (!Utils.instance) {
          Utils.instance = new Utils();
        }
        return Utils.instance;
    }
    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true; 
        } catch (error) {
            return false; 
        }
    }
    
    
    

}