const agendaTabs = document.querySelector("[data-agenda-tabs]");
const agendaSchedule = document.querySelector("[data-agenda-schedule]");

if (agendaTabs && agendaSchedule) {
  const tabs = [...agendaTabs.querySelectorAll("[data-agenda-day]")];
  const entries = [...agendaSchedule.querySelectorAll("[data-agenda-entry]")];
  const title = document.querySelector("[data-agenda-title]:not(button)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let titleAnimationId = 0;

  function renderTitle(text) {
    if (!title) return [];

    const fragment = document.createDocumentFragment();
    const letters = [];

    text.split(" ").forEach((word, wordIndex, words) => {
      const wordElement = document.createElement("span");
      wordElement.className = "agenda-day-message-word";

      [...word].forEach((character) => {
        const letter = document.createElement("span");
        letter.className = "agenda-day-message-letter";
        letter.textContent = character;
        wordElement.append(letter);
        letters.push(letter);
      });

      fragment.append(wordElement);
      if (wordIndex < words.length - 1) fragment.append(" ");
    });

    title.replaceChildren(fragment);
    title.setAttribute("aria-label", text);
    return letters;
  }

  async function updateTitle(text) {
    if (!title || title.getAttribute("aria-label") === text) return;

    const animationId = ++titleAnimationId;
    const currentLetters = [...title.querySelectorAll(".agenda-day-message-letter")];

    if (reducedMotion.matches || currentLetters.length === 0) {
      renderTitle(text);
      return;
    }

    const exitAnimations = currentLetters.map((letter, index) => letter.animate(
      [
        { opacity: 1, transform: "translateY(0) rotate(0deg)" },
        { opacity: 0, transform: "translateY(-0.55em) rotate(-4deg)" },
      ],
      {
        duration: 230,
        delay: index * 5,
        easing: "cubic-bezier(0.55, 0, 1, 0.45)",
        fill: "forwards",
      },
    ));

    await Promise.allSettled(exitAnimations.map((animation) => animation.finished));
    if (animationId !== titleAnimationId) return;

    const incomingLetters = renderTitle(text);
    incomingLetters.forEach((letter, index) => {
      letter.animate(
        [
          { opacity: 0, transform: "translateY(0.65em) rotate(5deg)" },
          { opacity: 1, transform: "translateY(0) rotate(0deg)" },
        ],
        {
          duration: 430,
          delay: index * 11,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      );
    });
  }

  function selectDay(day, moveFocus = false) {
    const activeTab = tabs.find((tab) => tab.dataset.agendaDay === day);
    if (!activeTab) return;

    agendaTabs.dataset.activeDay = day;

    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    entries.forEach((entry) => {
      const isVisible = entry.dataset.agendaEntry === day;
      entry.hidden = !isVisible;
    });

    const fullDate = `${day} de septiembre`;
    updateTitle(activeTab.dataset.agendaTitle ?? "");
    agendaSchedule.setAttribute("aria-label", `Agenda del ${fullDate}`);

    if (moveFocus) activeTab.focus();
  }

  agendaTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-agenda-day]");
    if (tab) selectDay(tab.dataset.agendaDay);
  });

  agendaTabs.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    selectDay(tabs[nextIndex].dataset.agendaDay, true);
  });

  renderTitle(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.agendaTitle ?? "");
}
