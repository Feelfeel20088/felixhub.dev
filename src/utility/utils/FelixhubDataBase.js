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
const mysql2_1 = __importDefault(require("mysql2"));
exports.default = new class FelixhubDataBase {
    constructor() {
        this.pool = mysql2_1.default.createPool({
            host: 'localhost', // MySQL server host
            user: 'root', // Database username
            password: 'password', // Database password
            database: 'felixhub.dev', // Database name
            waitForConnections: true,
            connectionLimit: 10, // Max number of connections
            queueLimit: 0
        });
        this.startDataBase(); // will do nothing if tables allredy set 
    }
    startDataBase() {
        return __awaiter(this, void 0, void 0, function* () {
            const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
            yield this.pool.promise().query(createUsersTable);
            const createContextTable = `CREATE TABLE IF NOT EXISTS context (
            id INT AUTO_INCREMENT PRIMARY KEY,             
            user_id INT NOT NULL,                           
            model_name VARCHAR(255) NOT NULL,               
            context_name VARCHAR(255) NOT NULL,            
            context_data TEXT NOT NULL,                     
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            FOREIGN KEY (user_id) REFERENCES users(id)      
        );`;
            yield this.pool.promise().query(createContextTable);
        });
    }
    // -----------------
    //       users
    // -----------------
    createUser(username, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO context (username, password, email)
            values (?, ?, ?);
        `;
            yield this.pool.promise().query(query, [username, password, email]);
        });
    }
    // -----------------
    //      context
    // -----------------
    createContext(userId, modelName, contextName, contextData) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO context (user_id, model_name, context_name, context_data)
            VALUES (?, ?, ?, ?);
        `;
            yield this.pool.promise().query(query, [userId, modelName, contextName, contextData]);
        });
    }
};
