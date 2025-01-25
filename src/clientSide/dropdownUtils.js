"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDropdownMenu = setupDropdownMenu;
function setupDropdownMenu(dropdownButton, dropdownMenu, inputField, callback) {
    dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });
    const dropdownOptions = dropdownMenu.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const target = event.target;
            const selectedAI = target.getAttribute('data-ai');
            if (selectedAI && inputField) {
                inputField.placeholder = `Message ${selectedAI}`;
                callback(selectedAI);
            }
            dropdownMenu.classList.add('hidden');
        });
    });
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
}
