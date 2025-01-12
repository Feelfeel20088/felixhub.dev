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
exports.handleChatRequest = void 0;
const URL_1 = __importDefault(require("../utility/config/URL"));
const handleChatRequest = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for auth here if necessary
    var _a;
    console.log("User request:");
    console.log(request.body);
    console.log("Fetching from Ollama API...");
    try {
        const response = yield fetch(URL_1.default.ollama_internal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llava',
                messages: [
                    Object.assign({ role: 'user' }, request.body)
                ]
            })
        });
        if (!response.ok) {
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
        while (true) {
            const { done, value } = yield reader.read();
            const bufferedData = decoder.decode(value, { stream: true });
            console.log(bufferedData);
            console.log(value);
            if (done) {
                console.log("Done reading response");
                reply.raw.end();
                return;
            }
            reply.raw.write(value);
        }
    }
    catch (error) {
        console.error(`Fetch error: ${error}`);
        reply.status(500).send({ error: 'Internal server error' });
    }
});
exports.handleChatRequest = handleChatRequest;
