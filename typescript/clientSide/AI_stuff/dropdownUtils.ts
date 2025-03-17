export function setupDropdownMenu(
    dropdownButton: HTMLButtonElement,
    dropdownMenu: HTMLDivElement,
    inputField: HTMLInputElement,
    callback: (selectedAI: string) => void
): void {
    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    const dropdownOptions = dropdownMenu.querySelectorAll('.dropdown-option') as NodeListOf<HTMLDivElement>;
    dropdownOptions.forEach(option => {
        option.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLDivElement;
            const selectedAI = target.getAttribute('data-ai') as string;
            if (selectedAI && inputField) {
                inputField.placeholder = `Message ${selectedAI}`;
                callback(selectedAI);
            }
            dropdownMenu.classList.add('hidden');
        });
    });

    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
}
