"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageBase64 = getImageBase64;
exports.previewImage = previewImage;
exports.clearImage = clearImage;
// File: utils/fileUtils.ts
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
function previewImage(fileInput, imagePreview, closeButton) {
    var _a;
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            imagePreview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            imagePreview.style.display = 'block';
            closeButton.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
function clearImage(fileInput, imagePreview, closeButton) {
    imagePreview.style.display = 'none';
    closeButton.style.display = 'none';
    imagePreview.src = "";
    fileInput.value = "";
}
