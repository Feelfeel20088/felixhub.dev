"use strict";
document.getElementById('open-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.add('open');
});
document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.remove('open');
});
