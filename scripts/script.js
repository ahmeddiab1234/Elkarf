const selectAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
const select = (selector, parent = document) => parent.querySelector(selector);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const smoothScrollLinks = selectAll('a[href^="#"]');
smoothScrollLinks.forEach(link => {
  link.addEventListener("click", event => {
    const section = select(link.getAttribute("href"));
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
selectAll(".hero-cta a").forEach(link => {
  const href = link.getAttribute("href");
  link.classList.toggle("active", href === currentPage);
});

selectAll(".skill-badges span").forEach((badge, index) => {
  badge.style.setProperty("--badge-index", index);
});

const revealElements = selectAll(
  ".hero-signals span, .about-container, .skill-badges span, .story-card, .stats-title, .stat-card, section, article"
);

const uniqueRevealElements = [...new Set(revealElements)];

if (prefersReducedMotion) {
  uniqueRevealElements.forEach(element => element.classList.add("is-visible"));
} else {
  uniqueRevealElements.forEach(element => element.classList.add("reveal-item"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -70px 0px"
  });

  uniqueRevealElements.forEach(element => revealObserver.observe(element));
}

selectAll(".slider").forEach(slider => {
  const img = select("img", slider);
  const prev = select(".prev", slider);
  const next = select(".next", slider);
  const images = (slider.dataset.images || "")
    .split(",")
    .map(src => src.trim())
    .filter(Boolean);

  if (!img || !prev || !next || images.length === 0) return;

  const width = Number.parseInt(slider.dataset.width, 10) || slider.offsetWidth || 700;
  const height = Number.parseInt(slider.dataset.height, 10) || slider.offsetHeight || 400;
  let index = Math.max(0, images.indexOf(img.getAttribute("src")));

  slider.style.position = "relative";
  slider.style.width = "100%";
  slider.style.maxWidth = `${width}px`;
  slider.style.aspectRatio = `${width} / ${height}`;
  slider.style.paddingTop = "0";

  Object.assign(img.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover"
  });

  const updateImage = () => {
    img.style.opacity = "0";

    window.setTimeout(() => {
      img.src = images[index];
      img.style.opacity = "1";
    }, prefersReducedMotion ? 0 : 160);
  };

  next.addEventListener("click", () => {
    index = (index + 1) % images.length;
    updateImage();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    updateImage();
  });
});

const toggleBtn = select("#theme-toggle");
const icon = toggleBtn ? select("i", toggleBtn) : null;

const applyTheme = dark => {
  document.body.classList.toggle("dark-mode", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
  icon?.classList.toggle("fa-moon", !dark);
  icon?.classList.toggle("fa-sun", dark);
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme === "dark");
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  applyTheme(true);
}

toggleBtn?.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark-mode"));
});

const typingEl = select("#typing");
const typingText = "Machine Learning & Deep Learning Engineer";

const typeEffect = () => {
  if (!typingEl) return;

  if (prefersReducedMotion) {
    typingEl.textContent = typingText;
    return;
  }

  let typingIndex = 0;
  const typingSpeed = 60;

  const typeNextCharacter = () => {
    typingEl.textContent = typingText.slice(0, typingIndex + 1);
    typingIndex++;

    if (typingIndex < typingText.length) {
      window.setTimeout(typeNextCharacter, typingSpeed);
    }
  };

  typeNextCharacter();
};

window.addEventListener("load", typeEffect);

const counters = selectAll(".stat-number");
const runCounters = () => {
  counters.forEach(counter => {
    const target = Number.parseInt(counter.dataset.target, 10) || 0;

    if (prefersReducedMotion) {
      counter.textContent = target;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const update = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(update);
  });
};

const statsSection = select(".stats-section");
if (statsSection && counters.length) {
  const statsObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;

    runCounters();
    statsObserver.disconnect();
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}
