// File: utils/fileUtils.ts
export function getImageBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            resolve((event.target?.result as string).split(',')[1]);
        };
        fileReader.onerror = reject;  // Rejects the promise if an error occurs
        fileReader.readAsDataURL(file);  // Reads the file as an ArrayBuffer
    });
}

export function previewImage(fileInput: HTMLInputElement, imagePreview: HTMLImageElement, closeButton: HTMLButtonElement): void {
    const file = fileInput.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target?.result as string;
            imagePreview.style.display = 'block';
            closeButton.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

export function clearImage(fileInput: HTMLInputElement, imagePreview: HTMLImageElement, closeButton: HTMLButtonElement): void {
    imagePreview.style.display = 'none';
    closeButton.style.display = 'none';
    imagePreview.src = "";
    fileInput.value = "";
}