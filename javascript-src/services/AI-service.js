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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FelixHubServiceBase_1 = __importDefault(require("../utility/FelixHubServiceBase"));
const URLS_1 = __importDefault(require("../utility/config/URLS"));
const SYSTEM_1 = __importDefault(require("../utility/config/SYSTEM"));
const controller = new AbortController();
class FelixHubChatService extends FelixHubServiceBase_1.default {
    // Define the callback method for the service
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const _b = req.body, { model } = _b, rest = __rest(_b, ["model"]);
            try {
                // Make a POST request to the Ollama API
                const response = yield fetch(URLS_1.default.ollama_local, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'system',
                                model: req.body.model,
                                content: SYSTEM_1.default.UNCENCORD_small
                            },
                            Object.assign({ role: 'user' }, rest),
                        ],
                    }),
                    signal: controller.signal
                });
                // Handle errors in the API response
                if (!response.ok) {
                    let reason = yield response.text();
                    console.warn(`something went wrong with ollama :( ${reason}`);
                    reply.status(500).send({ error: `Error getting AI response. ===== ${reason} ===== ` });
                    return;
                }
                const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                const decoder = new TextDecoder();
                if (!reader) {
                    reply.status(500).send({ error: 'No data in the response' });
                    return;
                }
                reply.type('text/event-stream');
                reply.header('Cache-Control', 'no-cache');
                reply.header('Connection', 'keep-alive');
                reply.header('Transfer-Encoding', 'chunked');
                // Stream the data from the response to the client
                while (true) {
                    const { done, value } = yield reader.read();
                    // const bufferedData = decoder.decode(value, { stream: true });
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
                reply.status(500).send({ error: error });
            }
        });
    }
}
exports.default = FelixHubChatService;
