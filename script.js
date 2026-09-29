// ===== Helpers =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const NAV_H = 68;

function scrollToSection(id) {
  const el = $(id);
  if (!el) return;
  const top =
    id === "#home"
      ? 0
      : el.getBoundingClientRect().top + window.scrollY - NAV_H + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

// ===== Navigation =====
const navLinks = $("#navLinks");
const menuBtn = $("#menuBtn");
const indicator = $("#navInd");
const links = $$(".nav-links a");

$$("[data-scroll]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToSection(a.getAttribute("href"));
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }),
);
menuBtn.addEventListener("click", () => {
  menuBtn.setAttribute("aria-expanded", navLinks.classList.toggle("open"));
});
$("#watchBtn").addEventListener("click", () => scrollToSection("#video"));

// Sliding underline under the active link
function moveIndicator(link) {
  if (!link) return;
  indicator.style.left = link.offsetLeft + "px";
  indicator.style.width = link.offsetWidth + "px";
}

// ===== Scroll: progress bar, navbar style, active section =====
const sections = $$("main section[id]");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("#progress").style.width = (scrollY / max) * 100 + "%";
  $("#nav").classList.toggle("scrolled", scrollY > 30);

  let current = "home";
  sections.forEach((s) => {
    if (scrollY >= s.offsetTop - NAV_H - 150) current = s.id;
  });
  links.forEach((l) => {
    const on = l.getAttribute("href") === "#" + current;
    l.classList.toggle("active", on);
    if (on) moveIndicator(l);
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

// ===== Reveal on scroll (staggered) =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12 },
);
$$(".reveal").forEach((el, i) => {
  el.style.setProperty(
    "--d",
    (el.closest(".hero-inner") || el.closest(".cards") ? (i % 5) * 0.12 : 0) +
      "s",
  );
  io.observe(el);
});

// ===== Cursor spotlight (page) =====
const spot = $("#spotlight");
addEventListener("pointermove", (e) => {
  spot.style.setProperty("--mx", e.clientX + "px");
  spot.style.setProperty("--my", e.clientY + "px");
});

// ===== Cards: glow follows cursor + gentle 3D tilt =====
const canTilt =
  matchMedia("(hover: hover)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;
$$(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    card.style.setProperty("--cx", x + "px");
    card.style.setProperty("--cy", y + "px");
    if (
      canTilt &&
      card.classList.contains("tilt") &&
      card.classList.contains("visible")
    ) {
      const rx = (y / r.height - 0.5) * -8,
        ry = (x / r.width - 0.5) * 8;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

// ===== Video: placeholder + big play button =====
const vid = $("#vid");
const placeholder = $("#placeholder");
vid.addEventListener("loadeddata", () => {
  placeholder.style.display = "none";
});
$("#bigPlay").addEventListener("click", () => vid.play().catch(() => {}));
