(() => {
  const root = document.documentElement;
  const progress = document.querySelector(".read-progress");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const toast = document.querySelector(".toast");
  let toastTimer;
  const updateProgress = () => {
    if (!progress) return;
    const max = root.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }
  const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
  document.querySelectorAll("[data-rotate]").forEach((el) => {
    const words = (el.dataset.rotate || "").split("|").filter(Boolean);
    if (words.length < 2) return;
    let index = 0;
    window.setInterval(() => {
      el.classList.add("is-switching");
      window.setTimeout(() => {
        index = (index + 1) % words.length;
        el.textContent = words[index];
        el.classList.remove("is-switching");
      }, 240);
    }, 2600);
  });
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll("[data-kind]");
    buttons.forEach((button) => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.kind.split(" ").includes(filter);
        card.hidden = !matches;
      });
    }));
  });
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
  };
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      showToast("Preview only - this form is not connected to the business inbox yet.");
    });
  });
  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Demo link copied.");
      } catch {
        showToast("Use your browser address bar to copy this demo link.");
      }
    });
  });
})();