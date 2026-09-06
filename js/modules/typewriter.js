(() => {
  const targets = document.querySelectorAll("[data-typewriter]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!targets.length || reducedMotion.matches) return;

  const wait = (duration) =>
    new Promise((resolve) => window.setTimeout(resolve, duration));

  const getCharacterDelay = (character, speed) => {
    if (/[,.;:!?]/.test(character)) return speed * 2.2;
    if (/\s/.test(character)) return speed * 0.45;
    return speed;
  };

  const prepareTarget = (target) => {
    const reservedHeight = target.getBoundingClientRect().height;
    const visual = document.createElement("span");
    const accessibleText = target.textContent.replace(/\s+/g, " ").trim();

    target.style.minHeight = `${reservedHeight}px`;
    visual.className = "typewriter-visual";
    visual.setAttribute("aria-hidden", "true");

    while (target.firstChild) {
      visual.append(target.firstChild);
    }

    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = accessibleText;
    target.append(accessible, visual);

    const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
    const fragments = [];
    let node = walker.nextNode();

    while (node) {
      fragments.push({ node, text: node.nodeValue });
      node.nodeValue = "";
      node = walker.nextNode();
    }

    return { visual, fragments };
  };

  const typeTarget = async (target) => {
    const delay = Number(target.dataset.typewriterDelay) || 0;
    const speed = Number(target.dataset.typewriterSpeed) || 60;
    const { visual, fragments } = prepareTarget(target);

    await wait(delay);
    visual.classList.add("is-typing");
    await wait(Math.min(speed, 140));

    for (const fragment of fragments) {
      for (const character of Array.from(fragment.text)) {
        fragment.node.nodeValue += character;
        await wait(getCharacterDelay(character, speed));
      }
    }

    visual.classList.remove("is-typing");
    visual.classList.add("is-complete");
    window.setTimeout(() => {
      visual.classList.remove("is-complete");
      target.style.removeProperty("min-height");
    }, 300);
  };

  targets.forEach((target) => {
    typeTarget(target);
  });
})();
