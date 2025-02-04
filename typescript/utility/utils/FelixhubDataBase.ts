import mysql from 'mysql2';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
import fs from 'fs'

export default new class FelixhubDataBase {
    pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',   // MySQL server host
            user: 'root',        // Database username
            password: 'password', // Database password
            database: 'felixhub.dev',  // Database name
            waitForConnections: true,
            connectionLimit: 10,  // Max number of connections
            queueLimit: 0
        });
        this.startDataBase(); // will do nothing if tables already set 
    }



    async startDataBase() {
        // Create Users Table
        const createUsersTable = 
        `CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            admin BOOLEAN NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
          

        await this.pool.promise().query(createUsersTable);
        
        // Create Context Table
        const createContextTable = 
        `CREATE TABLE IF NOT EXISTS context (
            id INT AUTO_INCREMENT PRIMARY KEY,             
            user_id INT NOT NULL,                           
            model_name VARCHAR(255) NOT NULL,               
            context_name VARCHAR(255) NOT NULL,            
            context_data TEXT NOT NULL,                     
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (user_id) REFERENCES users(id)      
        );`;
        
        await this.pool.promise().query(createContextTable);
    }

 
    // -----------------
    //       Users
    // -----------------
    public async createUser(username: string, password: string, email: string) {
        const query = `
            INSERT INTO users (username, password, email)
            VALUES (?, ?, ?);
        `;
        await this.pool.promise().query(query, [username, password, email]);
    }

    public async getUserMail(username: string) {

    }


    // -----------------
    //      Context
    // -----------------
    public async createContext(userId: number, modelName: string, contextName: string, contextData: string): Promise<void> { 
        const query = `
            INSERT INTO context (user_id, model_name, context_name, context_data)
            VALUES (?, ?, ?, ?);
        `;

        await this.pool.promise().query(query, [userId, modelName, contextName, contextData]);
    }
}
