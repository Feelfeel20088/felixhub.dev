"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dropdownUtils_1 = require("./dropdownUtils");
const chatHandler_1 = require("./chatHandler");
const fileUtils_1 = require("./fileUtils");
let selectedAI = "";
const userInput = document.getElementById("user-input");
const output = document.getElementById('output');
const submit = document.getElementById('submit');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById("imagePreview");
const closeButton = document.getElementById("closeButton");
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
(0, dropdownUtils_1.setupDropdownMenu)(dropdownButton, dropdownMenu, userInput, (ai) => {
    selectedAI = ai;
});
submit.addEventListener("click", () => {
    (0, chatHandler_1.sendMessage)(selectedAI, userInput, output, submit, fileInput);
});
fileInput.addEventListener("change", () => {
    (0, fileUtils_1.previewImage)(fileInput, imagePreview, closeButton);
});
closeButton.addEventListener("click", () => {
    (0, fileUtils_1.clearImage)(fileInput, imagePreview, closeButton);
});
