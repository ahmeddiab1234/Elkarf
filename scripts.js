// ====== Smooth Scroll for Navigation Links ======
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    const target = link.getAttribute('href');
    if (target.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(target);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ====== Highlight Active Navigation Link ======
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// ====== Fade-In Animation on Scroll ======
const fadeElements = document.querySelectorAll('section, article');

fadeElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
});

const fadeInOnScroll = () => {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }
  });
};

// Trigger fade-in on scroll and on page load
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);
