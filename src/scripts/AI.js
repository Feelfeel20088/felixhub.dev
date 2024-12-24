"use strict";
async function sendMessage() {
    console.log("send message called");
    const userinput = document.getElementById("user-input");
    const output = document.getElementById('output');
    const submit = document.getElementById('submit');
    const fileinput = document.getElementById('fileInput');
    if (userinput.value.trim() == "") {
        return;
    }
    output.innerHTML = "generating...";
    const userinputvar = userinput.value;
    userinput.value = "";
    submit.disabled = true;
    const file = fileinput.files?.[0];
    function getImageBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                resolve((event.target?.result).split(',')[1]);
            };
            fileReader.onerror = reject; // Rejects the promise if an error occurs
            fileReader.readAsDataURL(file); // Reads the file as an ArrayBuffer
        });
    }
    const imageBase64 = file ? await getImageBase64(file) : null;
    // TODO make sure this thagy can be sent without a file
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: userinputvar,
            images: imageBase64 ? [imageBase64] : []
        })
    });
    if (!response.ok) {
        submit.disabled = false;
        output.innerHTML = "";
        throw new Error("failed to get AI response. reason: " + response.statusText);
    }
    output.innerHTML = "";
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) {
        return;
    }
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            document.getElementById('submit').disabled = false;
            console.log("done");
            return;
        }
        const bufferedData = decoder.decode(value, { stream: true });
        const lines = bufferedData.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
            const jsondata = JSON.parse(lines[i]);
            output.innerHTML += jsondata.message.content;
        }
    }
}
function previewImage() {
    const file = document.getElementById('fileInput').files?.[0];
    const imagePreview = document.getElementById('imagePreview'); // Correct element reference
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target?.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
