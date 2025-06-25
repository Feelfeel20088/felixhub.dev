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
class ServePageService extends RootFelixHubServiceBase_1.default {
    callBack(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const fileName = (_a = this.params) === null || _a === void 0 ? void 0 : _a.fileName;
            const code = (_c = (_b = this.params) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : 200;
            try {
                const filePath = path_1.default.join(__dirname, "..", "..", "static", fileName);
                const data = yield promises_1.default.readFile(filePath, "utf-8");
                reply
                    .type("text/html")
                    .status(code)
                    .send(data);
            }
            catch (err) {
                reply.status(500).send("Error reading the HTML file");
            }
        });
    }
}
exports.default = ServePageService;
