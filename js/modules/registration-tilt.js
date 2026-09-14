(() => {
  const posters = [...document.querySelectorAll("[data-registration-tilt]")];
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (posters.length === 0 || !canTilt || reducedMotion) return;

  posters.forEach((poster) => {
    let frame = null;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const render = () => {
      frame = null;
      const rotateX = (0.5 - pointerY) * 4;
      const rotateY = (pointerX - 0.5) * 4;

      poster.style.setProperty("--poster-tilt-x", `${rotateX.toFixed(2)}deg`);
      poster.style.setProperty("--poster-tilt-y", `${rotateY.toFixed(2)}deg`);
      poster.style.setProperty("--poster-glare-x", `${(pointerX * 100).toFixed(1)}%`);
      poster.style.setProperty("--poster-glare-y", `${(pointerY * 100).toFixed(1)}%`);
    };

    poster.addEventListener("pointerenter", () => {
      poster.classList.add("is-tilting");
    });

    poster.addEventListener("pointermove", (event) => {
      const bounds = poster.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

      if (frame === null) frame = window.requestAnimationFrame(render);
    });

    poster.addEventListener("pointerleave", () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      poster.classList.remove("is-tilting");
      poster.style.setProperty("--poster-tilt-x", "0deg");
      poster.style.setProperty("--poster-tilt-y", "0deg");
      poster.style.setProperty("--poster-glare-x", "50%");
      poster.style.setProperty("--poster-glare-y", "50%");
    });
  });
})();
