const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const links = [...document.querySelectorAll(".nav-links a")];
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = [...document.querySelectorAll("main section[id]")];
const form = document.querySelector(".contact-form");
const statusText = document.querySelector(".form-status");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveLink = () => {
  const current = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 180 && rect.bottom >= 180;
  });

  links.forEach((link) => {
    const matches = current && link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", Boolean(matches));
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    html.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  } else {
    html.classList.remove("light-mode");
    themeToggle.textContent = "🌙";
  }
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLightMode = html.classList.toggle("light-mode");
    const theme = isLightMode ? "light" : "dark";
    localStorage.setItem("theme", theme);
    themeToggle.textContent = isLightMode ? "☀️" : "🌙";
  });
}

initTheme();

const preloader = document.getElementById("preloader");
const preloaderStart = performance.now();
const preloaderMinimum = 2200; // stay for at least 2.2 seconds

window.addEventListener("load", () => {
  const elapsed = performance.now() - preloaderStart;
  const wait = Math.max(0, preloaderMinimum - elapsed);

  window.setTimeout(() => {
    if (preloader) {
      preloader.classList.add("hidden");
      preloader.setAttribute("aria-hidden", "true");
    }
    setActiveLink();
  }, wait);
});

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.querySelector("#name")?.value.trim() || "there";
    statusText.textContent = `Thanks ${name}, your message is ready to send.`;
    form.reset();
  });
}
