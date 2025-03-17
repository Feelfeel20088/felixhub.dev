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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../secrets/.env' });
class GithubProjectGetter extends FelixHubServiceBase_1.default {
    constructor() {
        super(...arguments);
        this.token = process.env.GITHUB_TOKEN;
    }
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // const response = await fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`, {
            //     headers: {
            //         'Authorization': `token ${this.token}`
            //     }
            // });
            const response = yield fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`);
            reply.status(200).send(yield response.json());
        });
    }
}
exports.default = GithubProjectGetter;
