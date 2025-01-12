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
exports.serve_Quary = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const fileExists_1 = require("../utility/fileExists");
const serve_Quary = (folder) => {
    return (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const Quaryname = request.params.projectName;
        // Assuming the documentation files are stored in a "docs" folder
        const docPath = path_1.default.join(__dirname, '../static', folder, `${Quaryname.slice(1)}.html`);
        // Check if the file exists
        if (yield (0, fileExists_1.fileExists)(docPath)) {
            const data = yield promises_1.default.readFile(docPath, 'utf-8');
            reply.type('text/html').send(data);
        }
        else {
            console.log(docPath);
            reply.status(404);
        }
    });
};
exports.serve_Quary = serve_Quary;
