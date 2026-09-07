(() => {
  const title = document.querySelector("[data-hero-title-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!title || reducedMotion.matches) return;

  const text = title.textContent.trim();
  const accessibleText = document.createElement("span");
  const visual = document.createElement("span");
  const glyphs = [];

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));

  function easeOutBack(value) {
    const progress = clamp(value);
    const overshoot = 1.35;
    const shifted = progress - 1;

    return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2;
  }

  accessibleText.className = "sr-only";
  accessibleText.textContent = text;
  visual.className = "hero-title-visual";
  visual.setAttribute("aria-hidden", "true");

  [...text].forEach((character, index) => {
    const mask = document.createElement("span");
    const letter = document.createElement("span");
    const direction = index % 2 === 0 ? -1 : 1;

    mask.className = "hero-title-letter-mask";
    letter.className = "hero-title-letter";
    letter.textContent = character;
    mask.append(letter);
    visual.append(mask);
    glyphs.push({
      element: letter,
      x: direction * (8 + index * 3),
      y: -(390 + index * 22)
    });
  });

  title.replaceChildren(accessibleText, visual);

  const delay = 160;
  const duration = 1180;
  const stagger = 0.32;
  const startTime = performance.now();

  glyphs.forEach((glyph) => {
    glyph.element.style.transform = `translate3d(${glyph.x}px, ${glyph.y}%, 0)`;
    glyph.element.style.opacity = "0";
  });

  function animate(frameTime) {
    const progress = clamp((frameTime - startTime - delay) / duration);

    glyphs.forEach((glyph, index) => {
      const order = glyphs.length > 1 ? index / (glyphs.length - 1) : 0;
      const characterProgress = clamp((progress - order * stagger) / (1 - stagger));
      const movement = easeOutBack(characterProgress);
      const distance = 1 - movement;
      const normalizedMovement = clamp(movement);
      const shakeEnvelope = Math.sin(normalizedMovement * Math.PI);
      const shakePhase = normalizedMovement * Math.PI * 4.5 + index * 1.08;
      const shakeX = Math.sin(shakePhase) * 5.25 * shakeEnvelope;
      const shakeY = Math.cos(shakePhase) * 9 * shakeEnvelope;
      const x = glyph.x * distance + shakeX;
      const y = glyph.y * distance + shakeY;
      const opacityProgress = clamp(characterProgress / 0.42);
      const opacity = 1 - (1 - opacityProgress) ** 3;

      glyph.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}%, 0)`;
      glyph.element.style.opacity = opacity.toFixed(3);
    });

    if (progress < 1) {
      window.requestAnimationFrame(animate);
      return;
    }

  }

  window.requestAnimationFrame(animate);
})();
