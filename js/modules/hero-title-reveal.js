(() => {
  const title = document.querySelector("[data-hero-title-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!title || reducedMotion.matches) return;

  const text = title.textContent.trim();
  const accessibleText = document.createElement("span");
  const visual = document.createElement("span");
  const glyphs = [];

  accessibleText.className = "sr-only";
  accessibleText.textContent = text;
  visual.className = "hero-title-visual";
  visual.setAttribute("aria-hidden", "true");

  [...text].forEach((character, index) => {
    const mask = document.createElement("span");
    const letter = document.createElement("span");

    mask.className = "hero-title-letter-mask";
    letter.className = "hero-title-letter";
    letter.textContent = character;
    mask.append(letter);
    visual.append(mask);
    glyphs.push({ element: letter, index });
  });

  title.replaceChildren(accessibleText, visual);

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));
  const entryY = -320;
  const duration = 1120;
  const stagger = 110;
  const damping = 0.52;
  const angularFrequency = 9.5;
  const dampedFrequency = angularFrequency * Math.sqrt(1 - damping ** 2);
  const phaseRatio = damping / Math.sqrt(1 - damping ** 2);
  const fallDurationRatio = 0.17;
  const firstCrossing =
    (Math.PI - Math.atan(1 / phaseRatio)) / dampedFrequency;
  const startTime = performance.now() + 140;

  glyphs.forEach(({ element }) => {
    element.style.transform = `translate3d(0, ${entryY}%, 0)`;
    element.style.opacity = "0";
  });

  function animate(frameTime) {
    let animationRunning = false;

    glyphs.forEach(({ element, index }) => {
      const elapsed = frameTime - startTime - index * stagger;
      const progress = clamp(elapsed / duration);
      const responseProgress =
        progress < fallDurationRatio
          ? (progress / fallDurationRatio) * firstCrossing
          : firstCrossing + progress - fallDurationRatio;

      if (elapsed < duration) animationRunning = true;

      if (progress >= 1) {
        element.style.transform = "translate3d(0, 0, 0)";
        element.style.opacity = "1";
        return;
      }

      const envelope = Math.exp(-damping * angularFrequency * responseProgress);
      const wave =
        Math.cos(dampedFrequency * responseProgress) +
        phaseRatio * Math.sin(dampedFrequency * responseProgress);
      const y = entryY * envelope * wave;
      const opacityProgress = clamp(progress / 0.2);
      const opacity = 1 - (1 - opacityProgress) ** 3;

      element.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0)`;
      element.style.opacity = opacity.toFixed(3);
    });

    if (animationRunning) window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
})();
