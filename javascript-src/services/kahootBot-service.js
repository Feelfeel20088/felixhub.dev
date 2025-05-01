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
const URLS_1 = __importDefault(require("../utility/config/URLS"));
const RootFelixHubServiceBase_1 = __importDefault(require("../utility/RootFelixHubServiceBase"));
class kahootBotStartSwarm extends RootFelixHubServiceBase_1.default {
    // ttl default if not provided is 10
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.crash = req.body.crash === 'on' || req.body.crash === true;
            if (req.body.amount > 200 || req.body.ttl > 300) {
                reply.status(400).send({ error: "amount cant be greater then 200 and ttl cannot be greater then 300 (5m)" });
            }
            const index = req.body.gamepin.indexOf("pin=");
            let gamepin = "";
            if (req.body.gamepin.indexOf("pin=") !== -1) {
                for (let i = index + 4; !isNaN(Number(req.body.gamepin[i])); i++) {
                    gamepin += req.body.gamepin[i];
                }
                req.body.gamepin = gamepin;
            }
            try {
                const response = yield fetch(URLS_1.default.kahootbot_internal, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.assign({}, req.body)),
                });
                if (!response.ok) {
                    const errorDetails = yield response.text();
                    reply.status(response.status).send({ error: `Failed to start swarm: ${errorDetails}` });
                    return;
                }
                const responseData = yield response.json();
                reply.status(200).send({ success: true, data: responseData });
                return;
            }
            catch (error) {
                // Catch network or other errors
                console.error('Error during external request:', error);
                reply.status(500).send({ error: 'Internal Server Error' });
                return;
            }
        });
    }
}
exports.default = kahootBotStartSwarm;
