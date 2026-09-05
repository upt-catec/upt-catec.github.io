(() => {
  const transition = document.querySelector("[data-solar-transition]");
  const orbit = transition?.querySelector("[data-solar-transition-orbit]");
  const hero = document.querySelector(".hero");
  const heroSun = hero?.querySelector("[data-hero-sun]");

  if (!transition || !orbit || !hero || !heroSun) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = null;

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));

  const render = () => {
    frame = null;

    if (reducedMotion.matches) {
      orbit.style.removeProperty("--solar-transition-x");
      orbit.style.removeProperty("--solar-transition-turn");
      heroSun.style.removeProperty("--solar-transition-x");
      heroSun.style.removeProperty("--solar-transition-turn");
      return;
    }

    const heroBounds = hero.getBoundingClientRect();
    const scrollDistance = Math.max(
      1,
      hero.offsetHeight + transition.offsetHeight - window.innerHeight
    );
    const progress = clamp(-heroBounds.top / scrollDistance);
    const travel = window.innerWidth <= 760 ? 150 : 84;
    const horizontalPosition = `${(-travel * progress).toFixed(3)}vw`;
    const rotation = `${(-360 * progress).toFixed(2)}deg`;

    orbit.style.setProperty("--solar-transition-x", horizontalPosition);
    orbit.style.setProperty("--solar-transition-turn", rotation);
    heroSun.style.setProperty("--solar-transition-x", horizontalPosition);
    heroSun.style.setProperty("--solar-transition-turn", rotation);
  };

  const requestRender = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  reducedMotion.addEventListener?.("change", requestRender);
  render();
})();
