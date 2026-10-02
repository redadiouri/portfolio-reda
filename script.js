// Progressive enhancement: all content and contact links work without JavaScript.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("navigation");
const mobileViewport = window.matchMedia("(max-width: 760px)");

function closeMenu(returnFocus = false) {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  if (returnFocus) menuButton.focus();
}

function syncMenu() {
  closeMenu();
  menuButton.hidden = !mobileViewport.matches;
  navigation.toggleAttribute("data-collapsible", mobileViewport.matches);
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("is-open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu(true);
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeMenu();
});

mobileViewport.addEventListener("change", syncMenu);
syncMenu();
document.getElementById("year").textContent = new Date().getFullYear();

// All motion shares one preference: the OS setting or the visible pause control.
const motionButton = document.querySelector(".motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
let paused = false;
let frame = 0;
let lastFrame = 0;
const motionAllowed = () => !reducedMotion.matches && !paused;

// Reveal the content progressively without making it inaccessible without JS.
const revealElements = document.querySelectorAll(
  ".section-heading, .about-grid > div, .project, .academic-project, .skill, .education > div, .contact-heading",
);
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);
revealElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${(index % 3) * 80}ms`);
  revealObserver.observe(element);
});

// Local tilt: transform only the hovered surface, never the page or scroll.
const tiltElements = document.querySelectorAll(
  ".hero-panel, .project-cover, .skill",
);
tiltElements.forEach((element) => {
  element.classList.add("tilt-surface");
  element.addEventListener("pointermove", (event) => {
    if (!motionAllowed() || !finePointer.matches) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    element.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    element.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
    element.style.setProperty("--light-x", `${x * 100}%`);
    element.style.setProperty("--light-y", `${y * 100}%`);
  });
  element.addEventListener("pointerleave", () => {
    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
  });
});

// Scroll progress is scheduled once per rendering frame, not on every event.
const progress = document.querySelector(".scroll-progress");
let scrollScheduled = false;
function updateScroll() {
  const maximum = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${maximum > 0 ? scrollY / maximum : 0})`;
  document
    .querySelector(".header")
    .classList.toggle("has-scrolled", scrollY > 30);
  scrollScheduled = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);

// A small canvas constellation: capped particle count and device pixel ratio.
const canvas = document.getElementById("ambient-canvas");
const context = canvas.getContext("2d");
let particles = [];
let width = 0;
let height = 0;
const pointer = { x: -1000, y: -1000 };
function resizeCanvas() {
  width = innerWidth;
  height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: width < 760 ? 26 : 58 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: 1 + Math.random() * 1.5,
  }));
  updateScroll();
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener(
  "pointermove",
  (event) => {
    if (!finePointer.matches) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  },
  { passive: true },
);
document.documentElement.addEventListener("pointerleave", () => {
  pointer.x = pointer.y = -1000;
});
function drawFrame(time) {
  frame = 0;
  if (!context || !motionAllowed() || document.hidden) return;
  const delta = Math.min((time - (lastFrame || time)) / 16.67, 2);
  lastFrame = time;
  context.clearRect(0, 0, width, height);
  particles.forEach((particle, index) => {
    particle.x = (particle.x + particle.vx * delta + width) % width;
    particle.y = (particle.y + particle.vy * delta + height) % height;
    context.fillStyle = "rgba(64, 100, 65, 0.45)";
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
    // Nearby points connect into a slowly changing network.
    for (
      let otherIndex = index + 1;
      otherIndex < particles.length;
      otherIndex++
    ) {
      const other = particles[otherIndex];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 145) {
        context.strokeStyle = `rgba(64, 100, 65, ${0.16 * (1 - distance / 145)})`;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }
    const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
    if (distance < 180) {
      context.strokeStyle = `rgba(64, 100, 65, ${0.35 * (1 - distance / 180)})`;
      context.beginPath();
      context.moveTo(particle.x, particle.y);
      context.lineTo(pointer.x, pointer.y);
      context.stroke();
    }
  });
  frame = requestAnimationFrame(drawFrame);
}
function syncMotion() {
  document.body.classList.toggle("motion-enabled", motionAllowed());
  document.body.classList.toggle("background-paused", paused);
  motionButton.hidden = reducedMotion.matches;
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.textContent = paused
    ? "Activer les animations"
    : "Mettre les animations en pause";
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  lastFrame = 0;
  if (motionAllowed() && !document.hidden && context)
    frame = requestAnimationFrame(drawFrame);
}
motionButton.addEventListener("click", () => {
  paused = !paused;
  syncMotion();
});
reducedMotion.addEventListener("change", syncMotion);
document.addEventListener("visibilitychange", syncMotion);
resizeCanvas();
syncMotion();
