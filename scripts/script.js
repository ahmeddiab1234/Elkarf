const selectAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
const select = (selector, parent = document) => parent.querySelector(selector);

selectAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    const target = link.getAttribute('href');
    if (target.startsWith('#')) {
      e.preventDefault();
      const section = select(target);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const currentPage = window.location.pathname.split('/').pop();
selectAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

const fadeElements = selectAll('section, article');

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

window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

selectAll('.slider').forEach(slider => {
  const img = select('img', slider);
  const images = slider.dataset.images.split(',');
  let index = 0;

  const updateImage = () => img.src = images[index];

  select('.next', slider).addEventListener('click', () => {
    index = (index + 1) % images.length;
    updateImage();
  });

  select('.prev', slider).addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    updateImage();
  });
});


const toggleBtn = select('#theme-toggle');
const icon = select('i', toggleBtn);

const applyTheme = (dark) => {
  document.body.classList.toggle('dark-mode', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  icon.classList.toggle('fa-moon', !dark);
  icon.classList.toggle('fa-sun', dark);
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme === 'dark');
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);

toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  applyTheme(isDark);
});

const typingEl = select('#typing');
const typingText = "Machine Learning & Deep Learning Engineer";
let typingIndex = 0;
const typingSpeed = 60;

const typeEffect = () => {
  if (typingIndex < typingText.length) {
    typingEl.textContent += typingText.charAt(typingIndex);
    typingIndex++;
    setTimeout(typeEffect, typingSpeed);
  }
};

window.addEventListener('load', typeEffect);

document.querySelectorAll('.slider').forEach(slider => {
  const img = slider.querySelector('img');
  const images = slider.dataset.images.split(',');
  let index = 0;

  const w = slider.dataset.width ? parseInt(slider.dataset.width) : slider.offsetWidth;
  const h = slider.dataset.height ? parseInt(slider.dataset.height) : slider.offsetHeight;

  slider.style.position = 'relative';
  slider.style.width = '100%';
  slider.style.maxWidth = w + 'px';
  slider.style.paddingTop = (h / w * 100) + '%'; 
  slider.querySelector('img').style.position = 'absolute';
  slider.querySelector('img').style.top = 0;
  slider.querySelector('img').style.left = 0;
  slider.querySelector('img').style.width = '100%';
  slider.querySelector('img').style.height = '100%';
  slider.querySelector('img').style.objectFit = 'cover';

  const updateImage = () => img.src = images[index];

  slider.querySelector('.next').addEventListener('click', () => {
    index = (index + 1) % images.length;
    updateImage();
  });

  slider.querySelector('.prev').addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    updateImage();
  });
});

const counters = document.querySelectorAll('.stat-number');

const runCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const speed = 120;

    const update = () => {
      const current = +counter.innerText;
      const increment = Math.ceil(target / speed);

      if (current < target) {
        counter.innerText = current + increment;
        setTimeout(update, 20);
      } else {
        counter.innerText = target;
      }
    };

    update();
  });
};

// Trigger animation when section is visible
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    runCounters();
    observer.disconnect();
  }
}, { threshold: 0.4 });

observer.observe(document.querySelector('.stats-section'));



