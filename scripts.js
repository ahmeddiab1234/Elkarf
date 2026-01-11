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


// ====== IMAGE SLIDER ======
document.querySelectorAll('.slider').forEach(slider => {
  const img = slider.querySelector('img');
  const images = slider.dataset.images.split(',');
  let index = 0;

  slider.querySelector('.next').addEventListener('click', () => {
    index = (index + 1) % images.length;
    img.src = images[index];
  });

  slider.querySelector('.prev').addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    img.src = images[index];
  });
});


// ====== DARK MODE TOGGLE ======
const toggleBtn = document.getElementById('theme-toggle');
const icon = toggleBtn.querySelector('i');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  icon.classList.replace('fa-moon', 'fa-sun');
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
});

if (!localStorage.getItem('theme')) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }
}

