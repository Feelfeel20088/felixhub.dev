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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const FelixHubServiceBase_1 = __importDefault(require("../utility/FelixHubServiceBase"));
class ServePageService extends FelixHubServiceBase_1.default {
    // Implements the callback to handle the route logic
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const fileName = (_a = this.params) === null || _a === void 0 ? void 0 : _a.fileName; // Retrieve the fileName from params
            console.log(fileName);
            if (!fileName) {
                reply.status(400).send('Missing fileName parameter');
                return;
            }
            try {
                // Read the specified HTML file
                const filePath = path_1.default.join(__dirname, '../static', fileName);
                const data = yield promises_1.default.readFile(filePath, 'utf-8');
                reply.type('text/html').send(data); // Serve the HTML content
            }
            catch (err) {
                reply.status(500).send('Error reading the HTML file');
            }
        });
    }
}
exports.default = ServePageService;
