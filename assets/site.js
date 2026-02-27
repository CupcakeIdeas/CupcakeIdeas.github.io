// assets/site.js
(function () {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
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
  }

  const builder = document.querySelector("[data-builder]");
  if (builder) {
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

    if (mixBtn) {
      mixBtn.addEventListener("click", () => updateResult());
    }

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

  // simple "mailto" contact form
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("[name='name']").value.trim();
      const email = contactForm.querySelector("[name='email']").value.trim();
      const message = contactForm.querySelector("[name='message']").value.trim();

      const subject = encodeURIComponent(`Cupcakes Ideas message from ${name || "someone"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
      );

      const to = "cupcakeideasoffical@gmail.com";
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
})();