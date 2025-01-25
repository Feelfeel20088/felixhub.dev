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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const fileUtils_1 = require("./fileUtils");
function sendMessage(selectedAI, userInput, output, submit, fileInput) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log("send message called");
        if (userInput.value.trim() === "")
            return;
        output.innerHTML = "generating...";
        const userInputValue = userInput.value;
        userInput.value = "";
        submit.disabled = true;
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/"))) {
            alert("Invalid file. Ensure it is an image under 10MB.");
            submit.disabled = false;
            return;
        }
        const imageBase64 = selectedAI === "llava" && file ? [yield (0, fileUtils_1.getImageBase64)(file)] : [];
        try {
            const response = yield fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedAI,
                    content: userInputValue,
                    images: imageBase64
                })
            });
            if (!response.ok) {
                throw new Error("Failed to get AI response. Reason: " + response.statusText);
            }
            output.innerHTML = "";
            const reader = (_b = response.body) === null || _b === void 0 ? void 0 : _b.getReader();
            const decoder = new TextDecoder();
            if (!reader)
                return;
            while (true) {
                const { done, value } = yield reader.read();
                if (done) {
                    submit.disabled = false;
                    console.log("done");
                    return;
                }
                const bufferedData = decoder.decode(value, { stream: true });
                let lines = bufferedData.split('\n').filter(line => line.trim() !== "");
                lines.forEach(line => {
                    const jsonData = JSON.parse(line);
                    output.innerHTML += jsonData.message.content;
                });
            }
        }
        catch (error) {
            submit.disabled = false;
            output.innerHTML = "";
        }
    });
}
