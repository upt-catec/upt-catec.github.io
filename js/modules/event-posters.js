(() => {
  const carousel = document.querySelector("[data-event-posters]");
  if (!carousel) return;

  const posters = [...carousel.querySelectorAll("[data-event-poster]")];
  const status = carousel.querySelector("[data-event-poster-status]");

  if (posters.length < 2) return;

  let activeIndex = 0;
  let pointerId = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let suppressClick = false;
  let transitionTimer = null;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function resetDragStyles() {
    carousel.style.removeProperty("--active-x");
    carousel.style.removeProperty("--active-y");
    carousel.style.removeProperty("--active-tilt-x");
    carousel.style.removeProperty("--active-tilt-y");
    carousel.style.removeProperty("--active-scale");
    carousel.style.removeProperty("--active-opacity");
    carousel.style.removeProperty("--back-scale");
    carousel.style.removeProperty("--back-opacity");
  }

  function clearTransitionClasses() {
    window.clearTimeout(transitionTimer);
    posters.forEach((poster) => {
      poster.classList.remove(
        "moves-to-back-next",
        "moves-to-front-next",
        "moves-to-back-prev",
        "moves-to-front-prev",
        "click-spin-out",
        "click-spin-in"
      );
    });
  }

  function showPoster(
    index,
    direction = "next",
    announce = true,
    animate = true,
    transition = "orbit"
  ) {
    const nextIndex = (index + posters.length) % posters.length;
    const outgoingPoster = posters[activeIndex];
    const incomingPoster = posters[nextIndex];
    const shouldAnimate = animate && nextIndex !== activeIndex && !reducedMotion.matches;

    clearTransitionClasses();
    activeIndex = nextIndex;
    carousel.dataset.direction = direction;

    posters.forEach((poster, posterIndex) => {
      const isActive = posterIndex === activeIndex;
      poster.classList.toggle("is-active", isActive);
      poster.setAttribute("aria-pressed", String(isActive));
    });

    if (shouldAnimate) {
      if (transition === "spin") {
        outgoingPoster.classList.add("click-spin-out");
        incomingPoster.classList.add("click-spin-in");
        transitionTimer = window.setTimeout(clearTransitionClasses, 840);
      } else {
        outgoingPoster.classList.add(`moves-to-back-${direction}`);
        incomingPoster.classList.add(`moves-to-front-${direction}`);
        transitionTimer = window.setTimeout(clearTransitionClasses, 700);
      }
    }

    if (status && announce) {
      status.textContent = `Mostrando ${posters[activeIndex].dataset.posterName ?? `evento ${activeIndex + 1}`}`;
    }
  }

  function move(direction, animate = true, transition = "orbit") {
    const increment = direction === "next" ? 1 : -1;
    showPoster(activeIndex + increment, direction, true, animate, transition);
  }

  posters.forEach((poster, posterIndex) => {
    poster.addEventListener("click", () => {
      if (suppressClick) return;
      const direction = posterIndex === activeIndex ? "next" : posterIndex > activeIndex ? "next" : "prev";
      const targetIndex = posterIndex === activeIndex ? activeIndex + 1 : posterIndex;
      showPoster(targetIndex, direction, true, true, "spin");
    });
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? "next" : "prev");
  });

  carousel.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    carousel.classList.add("is-dragging");
    carousel.setPointerCapture(pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    let distanceX = event.clientX - pointerStartX;
    let distanceY = event.clientY - pointerStartY;
    const rawDistance = Math.hypot(distanceX, distanceY);
    const distanceScale = rawDistance > 130 ? 130 / rawDistance : 1;
    distanceX *= distanceScale;
    distanceY *= distanceScale;

    const progress = Math.min(1, rawDistance / 95);

    carousel.style.setProperty("--active-x", `${distanceX}px`);
    carousel.style.setProperty("--active-y", `${distanceY}px`);
    carousel.style.setProperty("--active-tilt-x", `${-distanceY / 11}deg`);
    carousel.style.setProperty("--active-tilt-y", `${distanceX / 9}deg`);
    carousel.style.setProperty("--active-scale", String(1 - progress * 0.06));
    carousel.style.setProperty("--active-opacity", String(1 - progress * 0.22));
    carousel.style.setProperty("--back-scale", String(0.97 + progress * 0.03));
    carousel.style.setProperty("--back-opacity", String(0.82 + progress * 0.18));
  });

  function finishDrag(event) {
    if (event.pointerId !== pointerId) return;

    const distanceX = event.clientX - pointerStartX;
    const distanceY = event.clientY - pointerStartY;
    const distance = Math.hypot(distanceX, distanceY);
    const shouldChange = distance >= 42;
    const isClick = distance < 12;
    const horizontalGesture = Math.abs(distanceX) >= Math.abs(distanceY);
    const direction = horizontalGesture
      ? distanceX < 0 ? "next" : "prev"
      : distanceY < 0 ? "next" : "prev";

    carousel.classList.remove("is-dragging");
    if (carousel.hasPointerCapture(pointerId)) carousel.releasePointerCapture(pointerId);
    pointerId = null;

    if (shouldChange) move(direction, false);
    else if (isClick) move("next", true, "spin");
    resetDragStyles();

    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
  }

  carousel.addEventListener("pointerup", finishDrag);
  carousel.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== pointerId) return;
    carousel.classList.remove("is-dragging");
    pointerId = null;
    resetDragStyles();
  });

  showPoster(0, "next", false);
})();
