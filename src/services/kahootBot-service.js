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
const URLS_1 = __importDefault(require("../utility/config/URLS"));
class kahootBotStartSwarm extends FelixHubServiceBase_1.default {
    // ttl default if not provided is 10
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle crash field (converting from 'on' or boolean to true/false)
            req.body.crash = req.body.crash === 'on' || req.body.crash === true;
            console.log(req.body.ttl);
            // Perform the external API request
            try {
                const response = yield fetch(URLS_1.default.kahootbot_local, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.assign({}, req.body)),
                });
                // Check if the response is successful
                if (!response.ok) {
                    // Log the error and return an appropriate error response
                    const errorDetails = yield response.text();
                    console.error(`Error: ${response.status} - ${errorDetails}`);
                    reply.status(response.status).send({ error: `Failed to start swarm: ${errorDetails}` });
                    return;
                }
                // If successful, send a success response
                const responseData = yield response.json();
                reply.send({ success: true, data: responseData });
            }
            catch (error) {
                // Catch network or other errors
                console.error('Error during external request:', error);
                reply.status(500).send({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = kahootBotStartSwarm;
