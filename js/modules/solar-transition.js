(() => {
  const transition = document.querySelector("[data-solar-transition]");
  const orbit = transition?.querySelector("[data-solar-transition-orbit]");
  const hero = document.querySelector(".hero");
  const heroSun = hero?.querySelector("[data-hero-sun]");
  const storyCopy = transition.querySelector(".solar-story-copy");
  const storySteps = [...transition.querySelectorAll("[data-solar-story-step]")];

  if (!transition || !orbit || !hero || !heroSun) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smoothingTime = 85;
  let frame = null;
  let lastFrameTime = null;
  let targetProgress = 0;
  let currentProgress = 0;
  let targetStoryProgress = 0;
  let currentStoryProgress = 0;
  let activeStoryStep = -1;

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

  const getStoryProgress = () => {
    const transitionBounds = transition.getBoundingClientRect();
    const scrollDistance = Math.max(1, transition.offsetHeight - window.innerHeight);

    return clamp(-transitionBounds.top / scrollDistance);
  };

  const renderStory = (progress) => {
    if (storySteps.length === 0) return;

    const copyTravel = window.innerWidth <= 760
      ? Math.min(180, window.innerHeight * 0.28)
      : Math.min(390, window.innerHeight * 0.44);
    const nextStep = Math.min(storySteps.length - 1, Math.floor(progress * storySteps.length));
    transition.style.setProperty("--solar-story-progress", progress.toFixed(4));
    storyCopy?.style.setProperty("--solar-story-shift", `${(-copyTravel * progress).toFixed(2)}px`);

    if (nextStep === activeStoryStep) return;
    activeStoryStep = nextStep;

    storySteps.forEach((step, index) => {
      const isActive = index === activeStoryStep;
      step.classList.toggle("is-active", isActive);
      if (isActive) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
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
    const storyDistance = targetStoryProgress - currentStoryProgress;

    lastFrameTime = time;
    currentProgress += distance * smoothing;
    currentStoryProgress += storyDistance * smoothing;

    if (Math.abs(distance) < 0.0001 && Math.abs(storyDistance) < 0.0001) {
      currentProgress = targetProgress;
      currentStoryProgress = targetStoryProgress;
      renderProgress(currentProgress);
      renderStory(currentStoryProgress);
      frame = null;
      lastFrameTime = null;
      return;
    }

    renderProgress(currentProgress);
    renderStory(currentStoryProgress);
    frame = window.requestAnimationFrame(animate);
  };

  const updateTarget = () => {
    targetProgress = getScrollProgress();
    targetStoryProgress = getStoryProgress();

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
      renderStory(0);
      return;
    }

    targetProgress = getScrollProgress();
    currentProgress = targetProgress;
    targetStoryProgress = getStoryProgress();
    currentStoryProgress = targetStoryProgress;
    renderProgress(currentProgress);
    renderStory(currentStoryProgress);
  };

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", updateTarget);
  reducedMotion.addEventListener?.("change", handleMotionChange);

  targetProgress = getScrollProgress();
  currentProgress = targetProgress;
  targetStoryProgress = getStoryProgress();
  currentStoryProgress = targetStoryProgress;
  handleMotionChange();
})();
