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
const RootFelixHubServiceBase_1 = __importDefault(require("../utility/RootFelixHubServiceBase"));
class FelixHubServeQueryService extends RootFelixHubServiceBase_1.default {
    // Override the callback method to implement the service logic
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure params has the folder key
            if (!this.params || !this.params.folder) {
                reply.status(500).send({ error: 'Service parameters are missing or incomplete.' });
                return;
            }
            const folder = this.params.folder; // Get folder from params
            const queryName = req.params.projectName;
            // Construct the document path
            const docPath = path_1.default.join(__dirname, "..", "..", "/static", folder, `${queryName.slice(1)}.html`);
            try {
                // Check if the file exists using the utils method
                if (yield this.utils.fileExists(docPath)) {
                    const data = yield promises_1.default.readFile(docPath, 'utf-8');
                    reply.type('text/html').send(data);
                }
                else {
                    console.log(`File not found at: ${docPath}`);
                    reply.status(404).send({ error: 'File not found' });
                }
            }
            catch (error) {
                console.error(`Error while serving query: ${error}`);
                reply.status(500).send({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = FelixHubServeQueryService;
