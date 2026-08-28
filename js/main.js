const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");
const themeButton = document.querySelector("#themeButton");
const themeIcon = themeButton.querySelector("i");
const savedTheme = localStorage.getItem("entre-o-que-sinto-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = theme;
  themeIcon.className = isDark ? "ri-sun-line" : "ri-moon-line";
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Ativar tema claro" : "Ativar tema escuro",
  );
}

applyTheme(savedTheme || preferredTheme);

function closeMenu() {
  mainNav.classList.remove("is-open");
  menuButton.querySelector("i").className = "ri-menu-3-line";
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("entre-o-que-sinto-theme", nextTheme);
});

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuButton.querySelector("i").className = isOpen
    ? "ri-close-line"
    : "ri-menu-3-line";
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", closeMenu),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener("scroll", () =>
  header.classList.toggle("is-scrolled", window.scrollY > 12),
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

const journalForm = document.querySelector("#journalForm");
const moodButtons = [...document.querySelectorAll(".mood-button")];
const bodyButtons = [...document.querySelectorAll(".body-button")];
const journalIntensity = document.querySelector("#journalIntensity");
const intensityOutput = document.querySelector("#intensityOutput");
const journalFact = document.querySelector("#journalFact");
const journalFeeling = document.querySelector("#journalFeeling");
const journalInterpretation = document.querySelector("#journalInterpretation");
const journalDesire = document.querySelector("#journalDesire");
const journalFear = document.querySelector("#journalFear");
const journalAdvice = document.querySelector("#journalAdvice");
const journalPrayer = document.querySelector("#journalPrayer");
const faithToggle = document.querySelector("#faithToggle");
const faithField = document.querySelector("#faithField");
const journalEntries = document.querySelector("#journalEntries");
const insightStats = document.querySelector("#insightStats");
const insightNote = document.querySelector("#insightNote");
const formMessage = document.querySelector("#formMessage");
const clearJournal = document.querySelector("#clearJournal");
const therapyNotes = document.querySelector("#therapyNotes");
const saveTherapyNotes = document.querySelector("#saveTherapyNotes");
const therapyNotesMessage = document.querySelector("#therapyNotesMessage");
const STORAGE_KEY = "entre-o-que-sinto-journal";
const THERAPY_NOTES_KEY = "entre-o-que-sinto-therapy-notes";

function getIntensityLabel(value) {
  if (value <= 3) return "Leve";
  if (value <= 6) return "Moderado";
  if (value <= 8) return "Intenso";
  return "Muito intenso";
}

function updateIntensity() {
  const value = Number(journalIntensity.value);
  intensityOutput.innerHTML = `<strong>${value}</strong> · ${getIntensityLabel(value)}`;
}

function toggleChoice(button, exclusiveGroup = []) {
  const willActivate = !button.classList.contains("is-active");
  exclusiveGroup.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.toggle("is-active", willActivate);
  button.setAttribute("aria-pressed", String(willActivate));
}

moodButtons.forEach((button) =>
  button.addEventListener("click", () => toggleChoice(button)),
);

bodyButtons.forEach((button) =>
  button.addEventListener("click", () => toggleChoice(button, bodyButtons)),
);

journalIntensity.addEventListener("input", updateIntensity);

faithToggle.addEventListener("change", () => {
  faithField.hidden = !faithToggle.checked;
});

function getEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

function normalizeEntry(entry, index) {
  return {
    id: entry.id || `legacy-${index}-${entry.createdAt || "entry"}`,
    createdAt: entry.createdAt || new Date().toISOString(),
    moods: Array.isArray(entry.moods)
      ? entry.moods
      : entry.mood
        ? [entry.mood]
        : [],
    intensity: Number(entry.intensity) || null,
    body: entry.body || "",
    fact: entry.fact || "",
    feeling: entry.feeling || "",
    interpretation: entry.interpretation || "",
    certainty: entry.certainty || "Não informado",
    desire: entry.desire || "",
    fear: entry.fear || "",
    controls: Array.isArray(entry.controls) ? entry.controls : [],
    advice: entry.advice || "",
    action: entry.action || "Não informado",
    prayer: entry.prayer || "",
  };
}

function renderField(label, value) {
  if (!value || (Array.isArray(value) && !value.length)) return "";
  const content = Array.isArray(value) ? value.join(", ") : value;
  return `<dl class="entry-field"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(content)}</dd></dl>`;
}

function renderEntries() {
  const entries = getEntries().map(normalizeEntry);
  if (!entries.length) {
    journalEntries.innerHTML =
      '<div class="journal-empty"><i class="ri-quill-pen-line" aria-hidden="true"></i><p>Nenhuma reflexão salva ainda. O primeiro registro pode começar apenas observando este momento.</p></div>';
    return;
  }

  journalEntries.innerHTML = entries
    .slice()
    .reverse()
    .map((entry) => {
      const moods = entry.moods.length ? entry.moods : ["Sem emoção registrada"];
      const intensity = entry.intensity
        ? `${entry.intensity}/10 · ${getIntensityLabel(entry.intensity)}`
        : "Não informada";
      return `<article class="journal-entry" data-entry-id="${escapeHtml(entry.id)}">
        <div class="journal-entry-head">
          <div class="journal-entry-moods">${moods.map((mood) => `<span class="journal-entry-mood">${escapeHtml(mood)}</span>`).join("")}</div>
          <time datetime="${escapeHtml(entry.createdAt)}">${formatDate(entry.createdAt)}</time>
        </div>
        <div class="entry-summary">
          ${renderField("Intensidade", intensity)}
          ${renderField("Fato", entry.fact)}
          ${renderField("O que senti", entry.feeling)}
          ${renderField("Minha interpretação", entry.interpretation)}
          ${renderField("Nível de certeza", entry.certainty)}
          ${renderField("Desejo", entry.desire)}
          ${renderField("Medo", entry.fear)}
          ${renderField("Minha decisão", entry.action)}
        </div>
        <div class="entry-details" id="details-${escapeHtml(entry.id)}" hidden>
          ${renderField("Sensação corporal", entry.body)}
          ${renderField("Está nas minhas mãos", entry.controls)}
          ${renderField("Conselho para um amigo", entry.advice)}
          ${renderField("Oração ou reflexão", entry.prayer)}
        </div>
        <div class="entry-actions">
          <button type="button" class="text-button entry-toggle" aria-expanded="false" aria-controls="details-${escapeHtml(entry.id)}"><i class="ri-arrow-down-s-line" aria-hidden="true"></i> Ver reflexão completa</button>
          <button type="button" class="text-button entry-delete"><i class="ri-delete-bin-line" aria-hidden="true"></i> Excluir reflexão</button>
        </div>
      </article>`;
    })
    .join("");
}

function renderInsights() {
  const entries = getEntries().map(normalizeEntry);
  const moodCounts = entries
    .flatMap((entry) => entry.moods)
    .reduce((counts, mood) => {
      counts[mood] = (counts[mood] || 0) + 1;
      return counts;
    }, {});
  const mostFrequentMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];
  const intensities = entries
    .map((entry) => entry.intensity)
    .filter((value) => Number.isFinite(value));
  const averageIntensity = intensities.length
    ? (intensities.reduce((total, value) => total + value, 0) / intensities.length).toFixed(1)
    : "—";
  const hypotheses = entries.filter(
    (entry) => entry.certainty === "É apenas uma hipótese",
  ).length;
  const waited = entries.filter(
    (entry) => entry.action === "Não. Posso esperar.",
  ).length;

  const stats = [
    [entries.length, "Registros"],
    [mostFrequentMood || "—", "Emoção mais registrada"],
    [averageIntensity, "Intensidade média"],
    [hypotheses, "Interpretações como hipótese"],
    [waited, 'Vezes em que escolhi “Posso esperar”'],
  ];
  insightStats.innerHTML = stats
    .map(([value, label]) => `<div class="insight-stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`)
    .join("");
  insightNote.textContent =
    entries.length < 2
      ? "Continue registrando. Com o tempo, seus próprios padrões começarão a aparecer aqui."
      : "Estes dados refletem somente o que você registrou neste navegador.";
}

function getSelectedValues(selector) {
  return [...document.querySelectorAll(selector)].map((input) => input.value);
}

function resetJournalSelections() {
  [...moodButtons, ...bodyButtons].forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
  });
  faithField.hidden = true;
  updateIntensity();
}

journalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    moods: moodButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.mood),
    intensity: Number(journalIntensity.value),
    body:
      bodyButtons.find((button) => button.classList.contains("is-active"))
        ?.dataset.body || "",
    fact: journalFact.value.trim(),
    feeling: journalFeeling.value.trim(),
    interpretation: journalInterpretation.value.trim(),
    certainty: document.querySelector('input[name="certainty"]:checked').value,
    desire: journalDesire.value.trim(),
    fear: journalFear.value.trim(),
    controls: getSelectedValues('input[name="control"]:checked'),
    advice: journalAdvice.value.trim(),
    action: document.querySelector('input[name="action"]:checked').value,
    prayer: faithToggle.checked ? journalPrayer.value.trim() : "",
  };
  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
  journalForm.reset();
  resetJournalSelections();
  formMessage.textContent = "Reflexão guardada neste navegador.";
  renderEntries();
  renderInsights();
  window.setTimeout(() => {
    formMessage.textContent = "";
  }, 3200);
});

journalEntries.addEventListener("click", (event) => {
  const entryElement = event.target.closest(".journal-entry");
  if (!entryElement) return;

  if (event.target.closest(".entry-toggle")) {
    const button = event.target.closest(".entry-toggle");
    const details = entryElement.querySelector(".entry-details");
    const willOpen = details.hidden;
    details.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.innerHTML = willOpen
      ? '<i class="ri-arrow-up-s-line" aria-hidden="true"></i> Recolher reflexão'
      : '<i class="ri-arrow-down-s-line" aria-hidden="true"></i> Ver reflexão completa';
  }

  if (event.target.closest(".entry-delete")) {
    if (!window.confirm("Deseja excluir esta reflexão? Esta ação não pode ser desfeita.")) return;
    const id = entryElement.dataset.entryId;
    const entries = getEntries().filter(
      (entry, index) => normalizeEntry(entry, index).id !== id,
    );
    saveEntries(entries);
    renderEntries();
    renderInsights();
  }
});

clearJournal.addEventListener("click", () => {
  if (!getEntries().length) return;
  if (
    !window.confirm("Deseja apagar todas as reflexões salvas neste navegador?")
  )
    return;
  localStorage.removeItem(STORAGE_KEY);
  renderEntries();
  renderInsights();
});

therapyNotes.value = localStorage.getItem(THERAPY_NOTES_KEY) || "";

saveTherapyNotes.addEventListener("click", () => {
  localStorage.setItem(THERAPY_NOTES_KEY, therapyNotes.value.trim());
  therapyNotesMessage.textContent = "Anotações guardadas neste navegador.";
  window.setTimeout(() => {
    therapyNotesMessage.textContent = "";
  }, 3200);
});

updateIntensity();
renderEntries();
renderInsights();

window.addEventListener("journal:updated", () => {
  renderEntries();
  renderInsights();
});
