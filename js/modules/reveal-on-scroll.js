(() => {
  const elements = [...document.querySelectorAll("[data-reveal]")];
  if (elements.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  elements.forEach((element) => {
    const delay = Number.parseFloat(element.dataset.revealDelay ?? "0");
    const distance = Number.parseFloat(element.dataset.revealDistance ?? "56");

    element.style.setProperty("--reveal-delay", `${Math.max(0, delay)}ms`);
    element.style.setProperty("--reveal-distance", `${Math.max(0, distance)}px`);
    element.classList.add("is-reveal-pending");
  });

  function reveal(element) {
    if (element.classList.contains("is-reveal-visible")) return;
    element.classList.add("is-reveal-visible");

    element.addEventListener("transitionend", (event) => {
      if (event.propertyName === "transform") element.classList.add("is-reveal-complete");
    });
  }

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  });

  elements.forEach((element) => observer.observe(element));
})();
