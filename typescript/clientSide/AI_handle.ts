function getImageBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            resolve((event.target?.result as string).split(',')[1]);
        };
        fileReader.onerror = reject;  // Rejects the promise if an error occurs
        fileReader.readAsDataURL(file);  // Reads the file as an ArrayBuffer
    });
}


async function sendMessage(): Promise<void> {
    console.log("send message called");
    const userinput = document.getElementById("user-input") as HTMLInputElement
    const output = document.getElementById('output') as HTMLParagraphElement
    const submit = document.getElementById('submit') as HTMLButtonElement
    const fileinput = document.getElementById('fileInput') as HTMLInputElement


    if (userinput.value.trim() == "") return;
    
    output.innerHTML = "generating...";
    const userinputvar = userinput.value
    userinput.value = "";
    submit.disabled = true;
    const file: File | undefined = fileinput.files?.[0];
    
    if (file && (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/"))) {
        alert("Invalid file. Ensure it is an image under 10MB.");
        submit.disabled = false;
        return;
    }

    const imageBase64 = file ? [await getImageBase64(file)] : [];
    // TODO make sure this thagy can be sent without a file
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
              content: userinputvar,
              images: imageBase64
            }   
        )
    });
    // put alert here 
    if (!response.ok) {
        submit.disabled = false;
        output.innerHTML = "";
        throw new Error("failed to get AI response. reason: " + response.statusText);
    }
    
    output.innerHTML = ""; // clear the current text. will be changed after i make context a thing
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) return;
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            submit.disabled = false;
            console.log("done")
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
    
   
}

function previewImage(): void {
    const closeButton = document.getElementById("closeButton") as HTMLButtonElement;
    const file = (document.getElementById("fileInput") as HTMLInputElement).files?.[0];
    const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target?.result as string;
            imagePreview.style.display = 'block';  // Show the image preview
            closeButton.style.display = 'block';  // Show the close button
        };
        reader.readAsDataURL(file);
    }
}

function clearImage(): void {
    const closeButton = document.getElementById("closeButton") as HTMLButtonElement;
    const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    imagePreview.style.display = 'none';  // Hide the image preview
    closeButton.style.display = 'none';  // Hide the close button
    imagePreview.src = "";  // Clear the image source
    fileInput.value = "";  // Clear the file input
}