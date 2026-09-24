(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem("vesper-theme");
  const preferred = stored || "dark";
  root.setAttribute("data-theme", preferred);

  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.setAttribute("aria-pressed", preferred === "light" ? "true" : "false");
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("vesper-theme", next);
      themeBtn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    });
  }

  const menuBtn = document.querySelector("[data-menu]");
  const panel = document.querySelector("[data-panel]");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        panel.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  document.querySelectorAll(".js-reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
    io.observe(el);
  });

  const cookie = document.querySelector("[data-cookie]");
  const consent = localStorage.getItem("vesper-consent");
  if (cookie && !consent) cookie.classList.add("is-open");

  document.querySelectorAll("[data-consent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("vesper-consent", btn.getAttribute("data-consent"));
      if (cookie) cookie.classList.remove("is-open");
    });
  });

  const form = document.querySelector("[data-consult-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const gdpr = data.get("gdpr");

      if (!name || !email || !message || !gdpr) {
        status.textContent = "Doplňte prosím všechna povinná pole a souhlas se zpracováním.";
        status.className = "form-status err";
        return;
      }
      if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
        status.textContent = "Zadejte platnou e-mailovou adresu.";
        status.className = "form-status err";
        return;
      }

      status.textContent = "Děkujeme. Ozveme se do jednoho pracovního dne.";
      status.className = "form-status ok";
      form.reset();
    });
  }
})();
