(() => {
  document.querySelectorAll("[data-sponsor-track]").forEach((track) => {
    const group = track.querySelector(".sponsor-group");

    if (!group) return;

    if (track.children.length === 1) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    }

    const row = track.closest(".sponsor-row");

    if (!row || row.querySelector(".sponsor-edge-refraction")) return;

    const refractionLayer = document.createElement("div");
    const refractedTrack = track.cloneNode(true);

    refractionLayer.className = "sponsor-edge-refraction";
    refractionLayer.setAttribute("aria-hidden", "true");
    refractedTrack.removeAttribute("data-sponsor-track");
    refractedTrack.classList.add("sponsor-track-refracted");
    refractionLayer.append(refractedTrack);
    row.append(refractionLayer);
    row.classList.add("is-ready");
  });
})();
