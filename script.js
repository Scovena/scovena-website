const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];

function activateLink(link) {
  navLinks.forEach(item => item.classList.remove("active"));
  link?.classList.add("active");
}

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

let clickLockUntil = 0;

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Highlight the item the user actually clicked immediately.
    activateLink(link);
    clickLockUntil = Date.now() + 900;
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const sections = navLinks
  .map(link => {
    const selector = link.getAttribute("href");
    const target = selector ? document.querySelector(selector) : null;
    return target ? { link, target } : null;
  })
  .filter(Boolean);

function syncActiveNav() {
  // During smooth-scroll after a click, don't let an earlier section steal the highlight.
  if (Date.now() < clickLockUntil) return;

  const probe = window.scrollY + 120;
  let current = sections[0];

  for (const item of sections) {
    const top = item.target.getBoundingClientRect().top + window.scrollY;
    if (top <= probe) current = item;
  }

  // When we're at the bottom, make Contact active reliably.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
    current = sections[sections.length - 1];
  }

  activateLink(current?.link);
}

window.addEventListener("scroll", syncActiveNav, { passive: true });
window.addEventListener("resize", syncActiveNav);
window.addEventListener("load", syncActiveNav);

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

syncActiveNav();
