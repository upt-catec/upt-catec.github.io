(() => {
  const story = document.querySelector("[data-speaker-story]");
  if (!story) return;

  const stage = story.querySelector("[data-speaker-story-stage]");
  const viewport = story.querySelector("[data-speaker-story-viewport]");
  const track = story.querySelector("[data-speaker-story-track]");
  const title = story.querySelector("[data-speaker-story-title]");
  const header = story.querySelector(".speaker-story-header");
  const headerCopy = header?.firstElementChild;
  const kicker = header?.querySelector(".section-kicker");
  const previousButton = story.querySelector("[data-speaker-story-prev]");
  const nextButton = story.querySelector("[data-speaker-story-next]");
  const cards = [...story.querySelectorAll("[data-speaker-story-card]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!stage || !viewport || !track || !title || cards.length === 0) return;

  let activeIndex = -1;
  let maximumShift = 0;
  let frame = null;
  let scatterScale = 1;
  let titleLayers = [];
  let targetShift = 0;
  let renderedShift = 0;
  let targetPhrase = 0;
  let renderedPhrase = 0;
  let expandedViewportTop = 290;
  let collapsedViewportTop = 220;
  let headingLift = 0;
  let previousFrameTime = performance.now();

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(maximum, Math.max(minimum, value));

  function smoothstep(start, end, value) {
    const progress = clamp((value - start) / (end - start));
    return progress * progress * (3 - 2 * progress);
  }

  function easeOutBack(value) {
    const progress = clamp(value);
    const overshoot = 1.35;
    const shifted = progress - 1;

    return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2;
  }

  function getScatterOffset(characterIndex, phraseIndex, entering) {
    const seed = (characterIndex + 1) * 31 + (phraseIndex + 1) * 47 + (entering ? 19 : 37);
    const horizontalDirection = (characterIndex + phraseIndex) % 2 === 0 ? -1 : 1;

    return {
      x: horizontalDirection * (5 + ((seed * 11) % 22)),
      y: (entering ? -1 : 1) * (370 + ((seed * 13) % 120))
    };
  }

  function createTitleLayer(text, phraseIndex) {
    const layer = document.createElement("span");
    layer.className = "speaker-story-title-layer";
    const glyphs = [];

    text.split(" ").forEach((word, wordIndex, words) => {
      const wordElement = document.createElement("span");
      wordElement.className = "speaker-story-word";

      [...word].forEach((letter) => {
        const letterMask = document.createElement("span");
        letterMask.className = "speaker-story-letter-mask";
        const letterElement = document.createElement("span");
        letterElement.className = "speaker-story-letter";
        letterElement.textContent = letter;
        letterMask.append(letterElement);
        wordElement.append(letterMask);

        glyphs.push({
          element: letterElement,
          mask: letterMask,
          order: 0,
          entering: getScatterOffset(glyphs.length, phraseIndex, true),
          leaving: getScatterOffset(glyphs.length, phraseIndex, false)
        });
      });

      layer.append(wordElement);
      if (wordIndex < words.length - 1) layer.append(" ");
    });

    return { element: layer, glyphs };
  }

  function prepareTitleLayers() {
    title.replaceChildren();
    titleLayers = cards.map((card, phraseIndex) => {
      const text = card.dataset.storyTitle ?? "Ponentes de CATEC 2026-II";
      const layer = createTitleLayer(text, phraseIndex);
      title.append(layer.element);
      return layer;
    });
  }

  function measureTitleBox() {
    title.style.height = "";
    const naturalHeight = Math.max(
      ...titleLayers.map((layer) => layer.element.offsetHeight),
      title.offsetHeight
    );
    if (naturalHeight > 0) title.style.height = `${naturalHeight}px`;

    titleLayers.forEach((layer) => {
      const layerWidth = Math.max(1, layer.element.clientWidth);

      layer.glyphs.forEach((glyph) => {
        const word = glyph.mask.parentElement;
        const horizontalPosition = (word?.offsetLeft ?? 0) + glyph.mask.offsetLeft;
        const availableWidth = Math.max(1, layerWidth - glyph.mask.offsetWidth);
        glyph.order = clamp(horizontalPosition / availableWidth);
      });
    });
  }

  function setGlyphPosition(glyph, x, y) {
    glyph.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}%, 0)`;
  }

  function animateLayer(layer, progress, entering) {
    const stagger = entering ? 0.3 : 0.4;
    layer.glyphs.forEach((glyph, glyphIndex) => {
      const characterProgress = clamp((progress - glyph.order * stagger) / (1 - stagger));
      const movement = entering
        ? easeOutBack(characterProgress)
        : smoothstep(0, 1, characterProgress);
      const offset = entering ? glyph.entering : glyph.leaving;
      const distance = entering ? 1 - movement : movement;
      const normalizedMovement = clamp(movement);
      const shakeEnvelope = Math.sin(normalizedMovement * Math.PI);
      const shakePhase = normalizedMovement * Math.PI * 4.5 + glyphIndex * 1.08;
      const shakeX = Math.sin(shakePhase) * 5.25 * shakeEnvelope;
      const shakeY = Math.cos(shakePhase) * 9 * shakeEnvelope;

      setGlyphPosition(
        glyph,
        offset.x * distance * scatterScale + shakeX,
        offset.y * distance + shakeY
      );
    });
  }

  function updateTitleMorph(progress) {
    if (titleLayers.length === 0) return;

    titleLayers.forEach((layer) => {
      layer.element.style.visibility = "hidden";
    });

    if (titleLayers.length === 1) {
      const onlyLayer = titleLayers[0];
      onlyLayer.element.style.visibility = "visible";
      animateLayer(onlyLayer, 0, false);
      return;
    }

    const timelineProgress = clamp(progress) * (titleLayers.length - 1);
    const segmentIndex = Math.min(titleLayers.length - 2, Math.floor(timelineProgress));
    const segmentProgress = segmentIndex === titleLayers.length - 2 && progress >= 1
      ? 1
      : timelineProgress - segmentIndex;
    const outgoingLayer = titleLayers[segmentIndex];
    const incomingLayer = titleLayers[segmentIndex + 1];
    const incomingDelay = 0.1;
    const incomingProgress = clamp(
      (segmentProgress - incomingDelay) / (1 - incomingDelay)
    );

    outgoingLayer.element.style.visibility = "visible";
    incomingLayer.element.style.visibility = "visible";
    animateLayer(outgoingLayer, segmentProgress, false);
    animateLayer(incomingLayer, incomingProgress, true);
  }

  function setActiveCard(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    cards.forEach((card, cardIndex) => {
      const isActive = cardIndex === activeIndex;
      card.classList.toggle("is-active", isActive);
      if (isActive) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });

    if (previousButton) previousButton.disabled = activeIndex === 0;
    if (nextButton) nextButton.disabled = activeIndex === cards.length - 1;
    targetPhrase = activeIndex;
    if (reducedMotion.matches) {
      renderedPhrase = activeIndex;
      updateTitleMorph(activeIndex / Math.max(1, cards.length - 1));
    }
  }

  function goToCard(index) {
    const safeIndex = Math.round(clamp(index, 0, cards.length - 1));
    const card = cards[safeIndex];
    const centeredShift = clamp(
      card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2,
      0,
      maximumShift
    );

    if (reducedMotion.matches) {
      viewport.scrollTo({ left: centeredShift, behavior: "smooth" });
      return;
    }

    const scrollableHeight = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = maximumShift > 0 ? centeredShift / maximumShift : 0;
    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    window.scrollTo({
      top: storyTop + progress * scrollableHeight,
      behavior: "smooth"
    });
  }

  function getCenteredCardIndex(shift) {
    const viewportCenter = viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, cardIndex) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2 - shift;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = cardIndex;
      }
    });

    return closestIndex;
  }

  function update(frameTime) {
    frame = null;
    if (reducedMotion.matches) return;

    const storyBounds = story.getBoundingClientRect();
    const scrollableHeight = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const progress = Math.min(1, Math.max(0, -storyBounds.top / scrollableHeight));
    const headerCollapse = smoothstep(0.015, 0.18, progress);
    const viewportTop = expandedViewportTop
      + (collapsedViewportTop - expandedViewportTop) * headerCollapse;
    const elapsed = Math.min(64, Math.max(0, frameTime - previousFrameTime));
    const horizontalEase = 1 - Math.exp(-elapsed / 92);
    previousFrameTime = frameTime;

    targetShift = maximumShift * progress;
    renderedShift += (targetShift - renderedShift) * horizontalEase;

    const activeCardIndex = getCenteredCardIndex(renderedShift);
    setActiveCard(activeCardIndex);

    const phraseDistance = targetPhrase - renderedPhrase;
    const phraseStep = elapsed / 430;
    renderedPhrase += Math.abs(phraseDistance) <= phraseStep
      ? phraseDistance
      : Math.sign(phraseDistance) * phraseStep;

    track.style.transform = `translate3d(${-renderedShift}px, 0, 0)`;
    stage.style.setProperty("--story-header-collapse", headerCollapse.toFixed(4));
    stage.style.setProperty("--story-header-blur", `${(headerCollapse * 12).toFixed(2)}px`);
    stage.style.setProperty("--story-kicker-shift", `${(headerCollapse * -24).toFixed(2)}px`);
    stage.style.setProperty("--story-heading-shift", `${(headerCollapse * -headingLift).toFixed(2)}px`);
    stage.style.setProperty("--story-viewport-top", `${viewportTop.toFixed(2)}px`);
    updateTitleMorph(renderedPhrase / Math.max(1, cards.length - 1));

    const horizontalIsMoving = Math.abs(targetShift - renderedShift) > 0.08;
    const titleIsMoving = Math.abs(targetPhrase - renderedPhrase) > 0.001;
    if (horizontalIsMoving || titleIsMoving) requestUpdate();
  }

  function requestUpdate() {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  }

  previousButton?.addEventListener("click", () => goToCard(activeIndex - 1));
  nextButton?.addEventListener("click", () => goToCard(activeIndex + 1));
  viewport.addEventListener("scroll", () => {
    if (reducedMotion.matches) setActiveCard(getCenteredCardIndex(viewport.scrollLeft));
  }, { passive: true });

  function measure() {
    scatterScale = clamp(parseFloat(window.getComputedStyle(title).fontSize) / 60, 0.72, 1.2);
    measureTitleBox();
    maximumShift = Math.max(0, track.scrollWidth - viewport.clientWidth);

    if (reducedMotion.matches) {
      story.classList.remove("is-enhanced");
      story.style.height = "";
      track.style.transform = "";
      targetShift = 0;
      renderedShift = 0;
      targetPhrase = 0;
      renderedPhrase = 0;
      setActiveCard(0);
      updateTitleMorph(0);
      return;
    }

    story.classList.add("is-enhanced");
    const stageHeight = stage.clientHeight;
    const kickerStyle = kicker ? window.getComputedStyle(kicker) : null;
    const kickerMargin = kickerStyle ? parseFloat(kickerStyle.marginBottom) || 0 : 0;
    headingLift = Math.min(76, (kicker?.offsetHeight ?? 0) + kickerMargin);
    const headerBottom = (header?.offsetTop ?? stageHeight * 0.12)
      + (headerCopy?.offsetHeight ?? stageHeight * 0.2);
    expandedViewportTop = clamp(headerBottom + 24, 220, 340);
    collapsedViewportTop = clamp(expandedViewportTop - headingLift, 170, expandedViewportTop);
    stage.style.setProperty("--story-viewport-top", `${expandedViewportTop}px`);
    targetShift = maximumShift * clamp(-story.getBoundingClientRect().top /
      Math.max(1, story.offsetHeight - stage.offsetHeight));
    renderedShift = clamp(renderedShift, 0, maximumShift);
    const breathingRoom = Math.min(window.innerHeight * 0.18, 140);
    const horizontalScrollDistance = maximumShift * 1.3;
    story.style.height = `${stage.offsetHeight + horizontalScrollDistance + breathingRoom}px`;
    previousFrameTime = performance.now();
    requestUpdate();
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure, { once: true });
  reducedMotion.addEventListener?.("change", measure);

  prepareTitleLayers();
  setActiveCard(0);
  updateTitleMorph(0);
  measure();
})();
