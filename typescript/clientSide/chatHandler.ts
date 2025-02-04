import { getImageBase64 } from "./fileUtils"

export async function sendMessage(
    selectedAI: string,
    userInput: HTMLInputElement,
    output: HTMLParagraphElement,
    submit: HTMLButtonElement,
    fileInput: HTMLInputElement
): Promise<void> {
    console.log("send message called");

    if (userInput.value.trim() === "") return;

    output.innerHTML = "generating...";
    const userInputValue = userInput.value;
    userInput.value = "";
    submit.disabled = true;

    const file: File | undefined = fileInput.files?.[0];
    if (file && (file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/"))) {
        alert("Invalid file. Ensure it is an image under 10MB.");
        submit.disabled = false;
        return;
    }

    const imageBase64 = selectedAI === "llava" && file ? [await getImageBase64(file)] : [];

    try {
        const response = await fetch('/chat', {
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
            throw new Error(await response.text());
        }

        output.innerHTML = "";
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) return;

        while (true) {
            const { done, value } = await reader.read();
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
    } catch (error) {
        submit.disabled = false;
        output.innerHTML = "";
    }
}