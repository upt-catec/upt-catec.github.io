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

  const waitUntilVisible = (target) => new Promise((resolve) => {
    if (!("IntersectionObserver" in window)) {
      resolve();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      resolve();
    }, {
      threshold: 0.01,
      rootMargin: "0px 0px 12% 0px",
    });

    observer.observe(target);
  });

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
    const textNodes = [];
    let node = walker.nextNode();

    while (node) {
      textNodes.push(node);
      node = walker.nextNode();
    }

    const characters = [];

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const tokens = textNode.nodeValue.match(/\s+|\S+/g) ?? [];

      tokens.forEach((token) => {
        if (/^\s+$/.test(token)) {
          fragment.append(document.createTextNode(" "));
          characters.push({ element: null, character: " " });
          return;
        }

        const word = document.createElement("span");
        word.className = "typewriter-word";

        Array.from(token).forEach((character) => {
          const characterElement = document.createElement("span");
          characterElement.className = "typewriter-character";
          characterElement.textContent = character;
          word.append(characterElement);
          characters.push({ element: characterElement, character });
        });

        fragment.append(word);
      });

      textNode.replaceWith(fragment);
    });

    return { visual, characters };
  };

  const typeTarget = async (target) => {
    const delay = Number(target.dataset.typewriterDelay) || 0;
    const speed = Number(target.dataset.typewriterSpeed) || 60;
    const { visual, characters } = prepareTarget(target);

    if (target.hasAttribute("data-typewriter-on-view")) {
      await waitUntilVisible(target);
    }

    await wait(delay);
    visual.classList.add("is-typing");
    await wait(Math.min(speed, 140));

    let currentCharacter = null;

    for (const item of characters) {
      if (item.element) {
        currentCharacter?.classList.remove("is-current");
        item.element.classList.add("is-visible", "is-current");
        currentCharacter = item.element;
      }
      await wait(getCharacterDelay(item.character, speed));
    }

    visual.classList.remove("is-typing");
    visual.classList.add("is-complete");
    window.setTimeout(() => {
      visual.classList.remove("is-complete");
      currentCharacter?.classList.remove("is-current");
      target.style.removeProperty("min-height");
    }, 300);
  };

  targets.forEach((target) => {
    typeTarget(target);
  });
})();
