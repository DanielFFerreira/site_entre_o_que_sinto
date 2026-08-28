const STORAGE_KEY = "entre-o-que-sinto-after-send";
const NOTES_KEY = "entre-o-que-sinto-after-send-therapy";
const JOURNAL_KEY = "entre-o-que-sinto-journal";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

const form = $("#messageSituationForm");
const history = $("#messageHistoryEntries");
const insights = $("#messageInsights");
const insightNote = $("#messageInsightNote");
const intensity = $("#situationIntensity");
const intensityOutput = $("#situationIntensityOutput");
const followupFields = $("#followupFields");
const formMessage = $("#situationFormMessage");

function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function localDateTimeValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function selectedValue(name, scope = document) {
  return $(`input[name="${name}"]:checked`, scope)?.value || "";
}

function field(label, value) {
  if (!value) return "";
  return `<div class="message-entry-field"><strong>${
    escapeHtml(label)
  }</strong><p>${escapeHtml(value)}</p></div>`;
}

function getEntries() {
  const entries = readStorage(STORAGE_KEY);
  return Array.isArray(entries) ? entries : [];
}

function saveEntries(entries) {
  writeStorage(STORAGE_KEY, entries);
}

function updateRepairReflection(value) {
  const answer = $("#repairAnswer");
  const fields = $("#repairFields");
  fields.hidden = value !== "Sim";
  if (value === "Não") {
    answer.textContent = "Talvez eu não precise corrigir nada agora.";
  } else if (value === "Não sei") {
    answer.textContent = "Posso esperar por mais realidade antes de agir.";
  } else if (value === "Sim") {
    answer.textContent =
      "Posso observar o que aconteceu antes de decidir como reparar.";
  } else answer.textContent = "";
}

$$('input[name="repair-evidence"]').forEach((input) =>
  input.addEventListener("change", () => updateRepairReflection(input.value))
);

const checkin = $("#messageCheckin");
function updateCheckin() {
  const waitingAnswers = [
    selectedValue("new-event", checkin) === "Não",
    selectedValue("reply-requested", checkin) === "Não",
    ["Não", "Não sei"].includes(selectedValue("concrete-problem", checkin)),
    selectedValue("something-new", checkin) === "Não",
    ["Sim", "Talvez"].includes(selectedValue("waiting-discomfort", checkin)),
    selectedValue("waiting-harm", checkin) === "Não",
  ].filter(Boolean).length;
  const answered = $$('input[type="radio"]:checked', checkin).length;
  const result = $("#checkinResult");
  const button = $("#chooseWait");
  if (answered < 6) {
    result.textContent =
      "Posso responder no meu tempo, sem transformar o check-in em uma prova.";
    button.hidden = true;
    return;
  }
  const canWait = waitingAnswers >= 3;
  result.textContent = canWait
    ? "Talvez eu não precise decidir nada agora."
    : "Talvez exista algo concreto para observar. Ainda posso agir com calma.";
  button.hidden = !canWait;
}

checkin.addEventListener("change", updateCheckin);
$("#chooseWait").addEventListener("click", () => {
  const journalEntries = readStorage(JOURNAL_KEY);
  const safeEntries = Array.isArray(journalEntries) ? journalEntries : [];
  safeEntries.push({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    moods: [],
    intensity: null,
    body: "",
    fact: "Fiz o check-in antes de enviar outra mensagem.",
    feeling: "Percebi que estava desconfortável com a espera.",
    interpretation:
      "Ainda não tenho informação nova suficiente para concluir que algo deu errado.",
    certainty: "É apenas uma hipótese",
    desire: "Gostaria de ter certeza de que está tudo bem.",
    fear: "Tenho medo de que minha mensagem tenha causado algum afastamento.",
    controls: ["Esperar por mais realidade antes de agir"],
    advice:
      "Posso observar o que acontece dentro de mim sem enviar outra mensagem agora.",
    action: "Não. Posso esperar.",
    prayer: "",
  });
  writeStorage(JOURNAL_KEY, safeEntries);
  window.dispatchEvent(new CustomEvent("journal:updated"));
  $("#checkinResult").textContent =
    "Escolha registrada: posso esperar e observar o que acontece em mim.";
});

$$("#messageBodyOptions button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const active = button.classList.toggle("is-active");
    button.setAttribute("aria-pressed", String(active));
  });
});

const therapyNotes = $("#afterTherapyNotes");
therapyNotes.value = localStorage.getItem(NOTES_KEY) || "";
$("#saveAfterTherapyNotes").addEventListener("click", () => {
  localStorage.setItem(NOTES_KEY, therapyNotes.value.trim());
  const message = $("#afterTherapyMessage");
  message.textContent = "Anotação guardada neste navegador.";
  window.setTimeout(() => {
    message.textContent = "";
  }, 3000);
});

intensity.addEventListener("input", () => {
  intensityOutput.textContent = intensity.value;
});

$$('input[name="wanted-followup"]').forEach((input) =>
  input.addEventListener("change", () => {
    followupFields.hidden = input.value !== "Sim";
  })
);

function collectEntry() {
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    situationDate: $("#situationDate").value,
    situation: $("#situationName").value.trim(),
    emotion: $("#situationEmotion").value.trim(),
    intensity: Number(intensity.value),
    message: $("#situationMessage").value.trim(),
    reply: $("#situationReply").value.trim(),
    fact: $("#situationFact").value.trim(),
    firstThought: $("#situationFirstThought").value.trim(),
    fear: $("#situationFear").value.trim(),
    feeling: $("#situationFeeling").value.trim(),
    wantedFollowup: selectedValue("wanted-followup", form),
    wantedMessage: $("#wantedMessage").value.trim(),
    wantedMessageReason: $("#wantedMessageReason").value.trim(),
    evidence: $("#situationEvidence").value.trim(),
    known: $("#situationKnown").value.trim(),
    unknown: $("#situationUnknown").value.trim(),
    decision: selectedValue("situation-decision", form),
    bodySignals: $$("#messageBodyOptions .is-active").map(
      (item) => item.dataset.value,
    ),
    bodyDescription: $("#bodyDescription").value.trim(),
    friendResponse: $("#friendResponse").value.trim(),
    friendJudgment: $("#friendJudgment").value.trim(),
    friendAdvice: $("#friendAdviceAfterSend").value.trim(),
    later: null,
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = getEntries();
  entries.push(collectEntry());
  saveEntries(entries);
  form.reset();
  $("#situationDate").value = localDateTimeValue();
  intensityOutput.textContent = "5";
  followupFields.hidden = true;
  formMessage.textContent = "Situação guardada neste navegador.";
  renderHistory();
  renderInsights();
  window.setTimeout(() => {
    formMessage.textContent = "";
  }, 3000);
});

function renderHistory() {
  const entries = getEntries();
  if (!entries.length) {
    history.innerHTML =
      '<div class="empty-message-history">Nenhuma situação registrada ainda.</div>';
    return;
  }
  history.innerHTML = entries
    .slice()
    .reverse()
    .map((entry) => {
      const later = entry.later || {};
      return `<article class="message-entry" data-id="${escapeHtml(entry.id)}">
      <div class="message-entry-head"><div><h4>${
        escapeHtml(entry.situation)
      }</h4><span>${escapeHtml(entry.emotion)} · intensidade ${
        escapeHtml(entry.intensity)
      }/10</span></div><time datetime="${escapeHtml(entry.situationDate)}">${
        formatDate(entry.situationDate)
      }</time></div>
      <div class="message-entry-summary">${
        field("Vontade de mandar outra mensagem", entry.wantedFollowup)
      }${field("Decisão tomada", entry.decision)}${
        field("O que aconteceu", entry.fact)
      }${field("Primeiro pensamento", entry.firstThought)}</div>
      <div class="message-entry-details" hidden>${
        field("O que escrevi", entry.message)
      }${field("O que respondeu", entry.reply)}${
        field("O que temi", entry.fear)
      }${field("O que senti", entry.feeling)}${
        field("O que eu queria mandar", entry.wantedMessage)
      }${field("Por que eu queria mandar", entry.wantedMessageReason)}${
        field("Evidência concreta", entry.evidence)
      }${field("O que sei", entry.known)}${
        field("O que não sei", entry.unknown)
      }${field("Sinais no corpo", (entry.bodySignals || []).join(", "))}${
        field("Como apareceu em mim", entry.bodyDescription)
      }${field("O que diria a um amigo", entry.friendResponse)}${
        field("Como julguei", entry.friendJudgment)
      }${field("Conselho ao amigo", entry.friendAdvice)}${
        field("O que aconteceu depois", later.outcome)
      }${field("Minha preocupação se confirmou?", later.confirmed)}${
        field("Como vejo a mensagem agora", later.currentView)
      }${field("O que aprendi", later.learning)}</div>
      <div class="message-entry-actions"><button type="button" class="text-button toggle-message-entry"><i class="ri-arrow-down-s-line"></i> Ver reflexão completa</button><button type="button" class="text-button revisit-message-entry"><i class="ri-history-line"></i> Revisitar depois</button><button type="button" class="text-button delete-message-entry"><i class="ri-delete-bin-line"></i> Excluir registro</button></div>
      <form class="revisit-panel" hidden><h5>O que aconteceu depois?</h5><label class="after-field">O que aconteceu depois?<textarea name="outcome" rows="3">${
        escapeHtml(later.outcome)
      }</textarea></label><fieldset><legend>Minha preocupação se confirmou?</legend><div class="segmented-options">${
        ["Sim", "Parcialmente", "Não", "Ainda não sei"].map((value) =>
          `<label><input type="radio" name="confirmed-${
            escapeHtml(entry.id)
          }" value="${value}" ${
            later.confirmed === value ? "checked" : ""
          }><span>${value}</span></label>`
        ).join("")
      }</div></fieldset><div class="revisit-grid"><label class="after-field">Olhando agora, como vejo aquela mensagem?<textarea name="currentView" rows="3">${
        escapeHtml(later.currentView)
      }</textarea></label><label class="after-field">O que aprendi com essa situação?<textarea name="learning" rows="3">${
        escapeHtml(later.learning)
      }</textarea></label></div><button class="button button-primary save-revisit" type="submit">Guardar atualização</button></form>
    </article>`;
    })
    .join("");
}

function renderInsights() {
  const entries = getEntries();
  if (entries.length < 2) {
    insights.hidden = true;
    insightNote.textContent =
      "Continue registrando. Os indicadores aparecerão quando houver pelo menos duas situações.";
    return;
  }
  insights.hidden = false;
  const average = (
    entries.reduce((sum, item) => sum + Number(item.intensity || 0), 0) /
    entries.length
  ).toFixed(1);
  const followups = entries.filter(
    (item) => item.wantedFollowup === "Sim",
  ).length;
  const waited = entries.filter((item) => item.decision === "Esperar").length;
  const confirmed = entries.filter(
    (item) => item.later?.confirmed === "Sim",
  ).length;
  const values = [
    [entries.length, "Vezes que registrei"],
    [average, "Intensidade média"],
    [followups, "Vontade de mandar outra"],
    [waited, "Escolhi esperar"],
    [confirmed, "Havia um problema confirmado"],
  ];
  insights.innerHTML = values
    .map(
      ([value, label]) =>
        `<div class="message-insight"><strong>${value}</strong><span>${label}</span></div>`,
    )
    .join("");
  insightNote.textContent =
    "Os números mostram somente aquilo que foi registrado neste navegador.";
}

history.addEventListener("click", (event) => {
  const entryElement = event.target.closest(".message-entry");
  if (!entryElement) return;
  if (event.target.closest(".toggle-message-entry")) {
    const details = $(".message-entry-details", entryElement);
    const button = event.target.closest(".toggle-message-entry");
    details.hidden = !details.hidden;
    button.innerHTML = details.hidden
      ? '<i class="ri-arrow-down-s-line"></i> Ver reflexão completa'
      : '<i class="ri-arrow-up-s-line"></i> Recolher reflexão';
  }
  if (event.target.closest(".revisit-message-entry")) {
    const panel = $(".revisit-panel", entryElement);
    panel.hidden = !panel.hidden;
  }
  if (event.target.closest(".delete-message-entry")) {
    if (
      !window.confirm(
        "Deseja excluir este registro? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }
    saveEntries(
      getEntries().filter((item) => item.id !== entryElement.dataset.id),
    );
    renderHistory();
    renderInsights();
  }
});

history.addEventListener("submit", (event) => {
  const panel = event.target.closest(".revisit-panel");
  if (!panel) return;
  event.preventDefault();
  const entryElement = panel.closest(".message-entry");
  const confirmed = $('input[type="radio"]:checked', panel)?.value ||
    "Ainda não sei";
  const entries = getEntries().map((item) =>
    item.id === entryElement.dataset.id
      ? {
        ...item,
        later: {
          outcome: $('[name="outcome"]', panel).value.trim(),
          confirmed,
          currentView: $('[name="currentView"]', panel).value.trim(),
          learning: $('[name="learning"]', panel).value.trim(),
          updatedAt: new Date().toISOString(),
        },
      }
      : item
  );
  saveEntries(entries);
  renderHistory();
  renderInsights();
});

$("#situationDate").value = localDateTimeValue();
updateCheckin();
renderHistory();
renderInsights();
