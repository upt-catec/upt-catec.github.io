(() => {
  const transition = document.querySelector("[data-solar-transition]");
  const orbit = transition?.querySelector("[data-solar-transition-orbit]");
  const hero = document.querySelector(".hero");
  const heroSun = hero?.querySelector("[data-hero-sun]");

  if (!transition || !orbit || !hero || !heroSun) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smoothingTime = 85;
  let frame = null;
  let lastFrameTime = null;
  let targetProgress = 0;
  let currentProgress = 0;

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));

  const getScrollProgress = () => {
    const heroBounds = hero.getBoundingClientRect();
    const scrollDistance = Math.max(
      1,
      hero.offsetHeight + transition.offsetHeight - window.innerHeight
    );

    return clamp(-heroBounds.top / scrollDistance);
  };

  const renderProgress = (progress) => {
    const travel = window.innerWidth <= 760 ? 150 : 84;
    const horizontalPosition = `${(-travel * progress).toFixed(3)}vw`;
    const rotation = `${(-360 * progress).toFixed(2)}deg`;

    orbit.style.setProperty("--solar-transition-x", horizontalPosition);
    orbit.style.setProperty("--solar-transition-turn", rotation);
    heroSun.style.setProperty("--solar-transition-x", horizontalPosition);
    heroSun.style.setProperty("--solar-transition-turn", rotation);
  };

  const clearProgress = () => {
    orbit.style.removeProperty("--solar-transition-x");
    orbit.style.removeProperty("--solar-transition-turn");
    heroSun.style.removeProperty("--solar-transition-x");
    heroSun.style.removeProperty("--solar-transition-turn");
  };

  const animate = (time) => {
    if (reducedMotion.matches) {
      frame = null;
      lastFrameTime = null;
      clearProgress();
      return;
    }

    const elapsed = Math.min(32, lastFrameTime === null ? 16.67 : time - lastFrameTime);
    const smoothing = 1 - Math.exp(-elapsed / smoothingTime);
    const distance = targetProgress - currentProgress;

    lastFrameTime = time;
    currentProgress += distance * smoothing;

    if (Math.abs(distance) < 0.0001) {
      currentProgress = targetProgress;
      renderProgress(currentProgress);
      frame = null;
      lastFrameTime = null;
      return;
    }

    renderProgress(currentProgress);
    frame = window.requestAnimationFrame(animate);
  };

  const updateTarget = () => {
    targetProgress = getScrollProgress();

    if (frame === null) {
      frame = window.requestAnimationFrame(animate);
    }
  };

  const handleMotionChange = () => {
    if (reducedMotion.matches) {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastFrameTime = null;
      clearProgress();
      return;
    }

    targetProgress = getScrollProgress();
    currentProgress = targetProgress;
    renderProgress(currentProgress);
  };

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", updateTarget);
  reducedMotion.addEventListener?.("change", handleMotionChange);

  targetProgress = getScrollProgress();
  currentProgress = targetProgress;
  handleMotionChange();
})();
