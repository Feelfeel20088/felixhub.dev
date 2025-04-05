(document.getElementById('open-btn') as HTMLElement).addEventListener('click', function() {
    (document.getElementById('sidebar') as HTMLElement).classList.add('open');
});

(document.getElementById('close-btn') as HTMLElement).addEventListener('click', function() {
    (document.getElementById('sidebar') as HTMLElement).classList.remove('open');
});
