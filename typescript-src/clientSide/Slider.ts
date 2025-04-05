const elements = document.querySelectorAll('.on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3
});

elements.forEach((el, i) => {
  (el as HTMLElement).style.setProperty('--delay', `${i * 0.1}s`);
  observer.observe(el);
});
