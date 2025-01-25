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
const FelixHubServiceBase_1 = __importDefault(require("../utility/FelixHubServiceBase"));
const URL_1 = __importDefault(require("../utility/config/URL"));
class FelixHubChatService extends FelixHubServiceBase_1.default {
    // Define the callback method for the service
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { model } = req.body;
            delete req.body.model; // just to make sure i dont have to set model as optianl
            try {
                // Make a POST request to the Ollama API
                const response = yield fetch(URL_1.default.ollama_external, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            Object.assign({ role: 'user' }, req.body),
                        ],
                    }),
                });
                // Handle errors in the API response
                if (!response.ok) {
                    console.warn(`something went wrong with ollama :( ${yield response.text()}`);
                    reply.status(500).send({ error: 'Error getting AI response' });
                    return;
                }
                const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                const decoder = new TextDecoder();
                if (!reader) {
                    reply.status(500).send({ error: 'No data in the response' });
                    return;
                }
                reply.type('application/json');
                // Stream the data from the response to the client
                while (true) {
                    const { done, value } = yield reader.read();
                    const bufferedData = decoder.decode(value, { stream: true });
                    if (done) {
                        console.log('Done reading response');
                        reply.raw.end();
                        return;
                    }
                    reply.raw.write(value);
                }
            }
            catch (error) {
                // Handle internal server errors
                console.error(`Fetch error: ${error}`);
                reply.status(500).send({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = FelixHubChatService;
