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
exports.servePage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Controller function to serve an HTML page
const servePage = (fileName) => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield promises_1.default.readFile(path_1.default.join(__dirname, '../static', fileName), 'utf-8');
            reply.type('text/html').send(data);
        }
        catch (err) {
            reply.status(500).send('Error reading the HTML file');
        }
    });
};
exports.servePage = servePage;
