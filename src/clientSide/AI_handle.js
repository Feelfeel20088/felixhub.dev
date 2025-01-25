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
let selectedAI;
function getImageBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            var _a;
            resolve(((_a = event.target) === null || _a === void 0 ? void 0 : _a.result).split(',')[1]);
        };
        fileReader.onerror = reject; // Rejects the promise if an error occurs
        fileReader.readAsDataURL(file); // Reads the file as an ArrayBuffer
    });
}
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log("send message called");
        const userinput = document.getElementById("user-input");
        const output = document.getElementById('output');
        const submit = document.getElementById('submit');
        const fileinput = document.getElementById('fileInput');
        if (userinput.value.trim() == "")
            return;
        output.innerHTML = "generating...";
        const userinputvar = userinput.value;
        userinput.value = "";
        submit.disabled = true;
        const file = (_a = fileinput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/"))) {
            alert("Invalid file. Ensure it is an image under 10MB.");
            submit.disabled = false;
            return;
        }
        const imageBase64 = file ? [yield getImageBase64(file)] : [];
        // TODO make sure this thagy can be sent without a file
        const response = yield fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: selectedAI,
                content: userinputvar,
                images: imageBase64
            })
        });
        // put alert here 
        if (!response.ok) {
            submit.disabled = false;
            output.innerHTML = "";
            throw new Error("failed to get AI response. reason: " + response.statusText);
        }
        output.innerHTML = ""; // clear the current text. will be changed after i make context a thing
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
            let lines = bufferedData.split('\n');
            lines = lines.filter(line => line.trim() !== "");
            lines.forEach(line => {
                const jsonData = JSON.parse(line);
                output.innerHTML += jsonData.message.content;
            });
        }
    });
}
function previewImage() {
    var _a;
    const closeButton = document.getElementById("closeButton");
    const file = (_a = document.getElementById("fileInput").files) === null || _a === void 0 ? void 0 : _a[0];
    const imagePreview = document.getElementById("imagePreview");
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            imagePreview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            imagePreview.style.display = 'block'; // Show the image preview
            closeButton.style.display = 'block'; // Show the close button
        };
        reader.readAsDataURL(file);
    }
}
function clearImage() {
    const closeButton = document.getElementById("closeButton");
    const imagePreview = document.getElementById("imagePreview");
    const fileInput = document.getElementById("fileInput");
    imagePreview.style.display = 'none'; // Hide the image preview
    closeButton.style.display = 'none'; // Hide the close button
    imagePreview.src = ""; // Clear the image source
    fileInput.value = ""; // Clear the file input
}
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const inputField = document.getElementById('user-input');
// Show/hide the dropdown menu
dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
});
// Handle option selection
const dropdownOptions = document.querySelectorAll('.dropdown-option');
dropdownOptions.forEach(option => {
    option.addEventListener('click', (event) => {
        const target = event.target;
        selectedAI = target.getAttribute('data-ai');
        if (selectedAI && inputField) {
            inputField.placeholder = `Message ${selectedAI}`;
        }
        dropdownMenu.classList.add('hidden'); // Hide the menu after selection
        console.log(`Selected AI: ${selectedAI}`); // Optional: For debugging
    });
});
// Close the dropdown menu when clicking outside
document.addEventListener('click', (event) => {
    const target = event.target;
    if (!dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
        dropdownMenu.classList.add('hidden');
    }
});
