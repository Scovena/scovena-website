const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];

function activateLink(link) {
  navLinks.forEach(item => {
    item.classList.remove("active");
    item.removeAttribute("aria-current");
  });
  if (link) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
}

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

const sectionLinks = navLinks
  .map(link => {
    const selector = link.getAttribute("href");
    const target = selector ? document.querySelector(selector) : null;
    return target ? { link, target } : null;
  })
  .filter(Boolean);

let clickLockUntil = 0;
let clickSyncTimer;

function syncActiveNav() {
  if (!sectionLinks.length || Date.now() < clickLockUntil) return;
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 78;
  const probe = window.scrollY + headerHeight + 42;
  let current = sectionLinks[0];

  sectionLinks.forEach(item => {
    if (item.target.offsetTop <= probe) current = item;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
    current = sectionLinks[sectionLinks.length - 1];
  }
  activateLink(current.link);
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    activateLink(link);
    clickLockUntil = Date.now() + 900;
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    clearTimeout(clickSyncTimer);
    clickSyncTimer = setTimeout(() => {
      clickLockUntil = 0;
      syncActiveNav();
    }, 950);
  });
});

window.addEventListener("scroll", syncActiveNav, { passive: true });
window.addEventListener("resize", syncActiveNav);
window.addEventListener("load", syncActiveNav);

document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});
syncActiveNav();

// Cookie / similar-technology preference.
// No analytics or advertising tools are currently initialized.
const COOKIE_PREF_KEY = "scovenaCookieConsent";
const cookieBanner = document.getElementById("cookie-banner");
const cookieModal = document.getElementById("cookie-modal");
const cookieAccept = document.getElementById("cookie-accept");
const cookieReject = document.getElementById("cookie-reject");
const cookiePolicyButtons = document.querySelectorAll("[data-open-cookie-policy]");
const cookieSettingsButtons = document.querySelectorAll("[data-open-cookie-settings]");
const cookieCloseButtons = document.querySelectorAll("[data-cookie-close]");

// This preference applies only to the current website version, which does not
// use optional analytics or advertising technologies. If such categories are
// introduced later, use a new versioned consent flow and updated notice.

function saveCookiePreference(value) {
  try { localStorage.setItem(COOKIE_PREF_KEY, value); } catch (e) {}
  if (cookieBanner) cookieBanner.hidden = true;
}

function showCookieBanner() {
  if (cookieBanner) cookieBanner.hidden = false;
}

function openCookieModal() {
  if (!cookieModal) return;
  cookieModal.hidden = false;
  document.body.classList.add("cookie-modal-open");
}

function closeCookieModal() {
  if (!cookieModal) return;
  cookieModal.hidden = true;
  document.body.classList.remove("cookie-modal-open");
}

let savedPreference = null;
try { savedPreference = localStorage.getItem(COOKIE_PREF_KEY); } catch (e) {}

if (!savedPreference) {
  showCookieBanner();
}

cookieAccept?.addEventListener("click", () => saveCookiePreference("accepted"));
cookieReject?.addEventListener("click", () => saveCookiePreference("rejected"));
cookiePolicyButtons.forEach(button => button.addEventListener("click", openCookieModal));
cookieSettingsButtons.forEach(button => button.addEventListener("click", () => {
  try { localStorage.removeItem(COOKIE_PREF_KEY); } catch (e) {}
  showCookieBanner();
}));
cookieCloseButtons.forEach(button => button.addEventListener("click", closeCookieModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cookieModal && !cookieModal.hidden) closeCookieModal();
});


// Quotation request modal
const quoteModal = document.getElementById("quote-modal");
const quoteOpenButtons = document.querySelectorAll("[data-open-quote-modal]");
const quoteCloseButtons = document.querySelectorAll("[data-quote-close]");

function openQuoteModal() {
  if (!quoteModal) return;
  quoteModal.hidden = false;
  document.body.classList.add("dialog-open");
}

function closeQuoteModal() {
  if (!quoteModal) return;
  quoteModal.hidden = true;
  document.body.classList.remove("dialog-open");
}

quoteOpenButtons.forEach(button => button.addEventListener("click", openQuoteModal));
quoteCloseButtons.forEach(button => button.addEventListener("click", closeQuoteModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && quoteModal && !quoteModal.hidden) closeQuoteModal();
});
