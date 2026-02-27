// assets/site.js
(function () {
  const STORAGE_KEY = "cupcakes_theme";
  const THEMES = [
    { id: "light", label: "Strawberry Light", note: "bright and cute" },
    { id: "dark", label: "Soft Dark", note: "easy on eyes" },
    { id: "cupcake-night", label: "Cupcake Night", note: "deep + dreamy" },
    { id: "mint", label: "Mint Cream", note: "fresh + clean" },
  ];

  function setTheme(themeId) {
    const html = document.documentElement;
    if (!themeId || themeId === "light") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", themeId);
    }
    try { localStorage.setItem(STORAGE_KEY, themeId || "light"); } catch {}
    const themeLabel = document.querySelector("[data-theme-label]");
    if (themeLabel) {
      const item = THEMES.find(t => t.id === (themeId || "light")) || THEMES[0];
      themeLabel.textContent = item.label;
    }
  }

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || ""; } catch { return ""; }
  }

  function initTheme() {
    const saved = getSavedTheme();
    if (saved) {
      setTheme(saved);
      return;
    }

    // Default to system preference if user never picked
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  function closeThemeMenu() {
    const menu = document.querySelector("[data-theme-menu]");
    const btn = document.querySelector("[data-theme-button]");
    if (menu) menu.setAttribute("data-open", "false");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function initThemeMenu() {
    const btn = document.querySelector("[data-theme-button]");
    const menu = document.querySelector("[data-theme-menu]");
    if (!btn || !menu) return;

    // Render items (so you only maintain this list in one place)
    const existing = menu.querySelector("[data-theme-items]");
    const itemsWrap = existing || menu;

    if (existing) existing.innerHTML = "";

    const wrap = existing || document.createElement("div");
    wrap.setAttribute("data-theme-items", "true");

    if (!existing) menu.appendChild(wrap);

    THEMES.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "theme-item";
      b.setAttribute("data-set-theme", t.id);
      b.innerHTML = `
        <span>
          <strong>${t.label}</strong><br/>
          <small>${t.note}</small>
        </span>
        <span class="theme-dot" aria-hidden="true"></span>
      `;
      b.addEventListener("click", () => {
        setTheme(t.id);
        closeThemeMenu();
      });
      wrap.appendChild(b);
    });

    btn.addEventListener("click", () => {
      const open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const inside = menu.contains(target) || btn.contains(target);
      if (!inside) closeThemeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeThemeMenu();
    });
  }

  function initYear() {
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initNav() {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector(".nav");
    if (!navToggle || !nav) return;

    navToggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const isInside = nav.contains(target) || navToggle.contains(target);
      if (!isInside) {
        nav.setAttribute("data-open", "false");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        nav.setAttribute("data-open", "false");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initBuilder() {
    const builder = document.querySelector("[data-builder]");
    if (!builder) return;

    const base = builder.querySelector("[data-base]");
    const frosting = builder.querySelector("[data-frosting]");
    const topper = builder.querySelector("[data-topper]");
    const mixBtn = builder.querySelector("[data-mix]");
    const resultText = document.querySelector("[data-result-text]");
    const copyBtn = document.querySelector("[data-copy]");

    const updateResult = () => {
      const text = `${base.value} + ${frosting.value} + ${topper.value}`;
      if (resultText) resultText.textContent = text;
      return text;
    };

    if (mixBtn) mixBtn.addEventListener("click", () => updateResult());

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const text = updateResult();
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 900);
        } catch {
          copyBtn.textContent = "Copy failed";
          setTimeout(() => (copyBtn.textContent = "Copy"), 900);
        }
      });
    }
  }

  function initContactForm() {
    const contactForm = document.querySelector("[data-contact-form]");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("[name='name']").value.trim();
      const email = contactForm.querySelector("[name='email']").value.trim();
      const message = contactForm.querySelector("[name='message']").value.trim();

      const subject = encodeURIComponent(`Cupcakes Ideas message from ${name || "someone"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
      );

      // Set this to your email
      const to = "staticquasar931@gmail.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  initTheme();
  initYear();
  initNav();
  initThemeMenu();
  initBuilder();
  initContactForm();
})();