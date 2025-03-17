import { setupDropdownMenu } from "./dropdownUtils";
import { sendMessage } from "./chatHandler";
import {previewImage, clearImage} from "./fileUtils"
let selectedAI = "";

const userInput = document.getElementById("user-input") as HTMLInputElement;
const output = document.getElementById('output') as HTMLParagraphElement;
const submit = document.getElementById('submit') as HTMLButtonElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
const closeButton = document.getElementById("closeButton") as HTMLButtonElement;
const dropdownButton = document.querySelector('.dropdown-button') as HTMLButtonElement;
const dropdownMenu = document.querySelector('.dropdown-menu') as HTMLDivElement;

setupDropdownMenu(dropdownButton, dropdownMenu, userInput, (ai: string) => {
    selectedAI = ai;
});

submit.addEventListener("click", () => {
    sendMessage(selectedAI, userInput, output, submit, fileInput);
});

fileInput.addEventListener("change", () => {
    previewImage(fileInput, imagePreview, closeButton);
});

closeButton.addEventListener("click", () => {
    clearImage(fileInput, imagePreview, closeButton);
});
