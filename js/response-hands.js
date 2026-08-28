const STATE_KEY = "entre-o-que-sinto-response-hands";
const WAIT_KEY = "entre-o-que-sinto-response-hands-waits";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (
  selector,
  scope = document,
) => [...scope.querySelectorAll(selector)];

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function selected(name) {
  return $(`input[name="${name}"]:checked`)?.value || "";
}

function setRadio(name, value) {
  const input = $$(`input[name="${name}"]`).find((item) =>
    item.value === value
  );
  if (input) input.checked = true;
}

function value(id) {
  return $(id).value.trim();
}

function collectState() {
  return {
    urges: $$("#waitingUrges .is-active").map((button) => button.dataset.value),
    urgeExpectation: value("#urgeExpectation"),
    urgeReason: selected("urge-reason"),
    necessaryAction: selected("necessary-action"),
    exercise: {
      happened: value("#handsWhatHappened"),
      want: value("#handsWhatWant"),
      fear: value("#handsWhatFear"),
      know: value("#handsWhatKnow"),
      doNow: value("#handsWhatDo"),
    },
    therapy: {
      feeling: value("#handsTherapyFeeling"),
      fear: value("#handsTherapyFear"),
      explanation: value("#handsTherapyExplain"),
      understand: value("#handsTherapyUnderstand"),
    },
    revisit: {
      outcome: selected("hands-outcome"),
      confirmed: selected("hands-confirmed"),
      laterView: value("#handsLaterView"),
      learning: value("#handsLaterLearning"),
    },
    updatedAt: new Date().toISOString(),
  };
}

function saveState(messageElement, message) {
  localStorage.setItem(STATE_KEY, JSON.stringify(collectState()));
  messageElement.textContent = message;
  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 3200);
}

function restoreState() {
  const state = readJson(STATE_KEY, {});
  (state.urges || []).forEach((urge) => {
    const button = $$("#waitingUrges button").find((item) =>
      item.dataset.value === urge
    );
    if (button) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    }
  });
  if (state.urgeExpectation) {
    $("#urgeExpectation").value = state.urgeExpectation;
  }
  setRadio("urge-reason", state.urgeReason);
  setRadio("necessary-action", state.necessaryAction);
  const fields = {
    "#handsWhatHappened": state.exercise?.happened,
    "#handsWhatWant": state.exercise?.want,
    "#handsWhatFear": state.exercise?.fear,
    "#handsWhatKnow": state.exercise?.know,
    "#handsWhatDo": state.exercise?.doNow,
    "#handsTherapyFeeling": state.therapy?.feeling,
    "#handsTherapyFear": state.therapy?.fear,
    "#handsTherapyExplain": state.therapy?.explanation,
    "#handsTherapyUnderstand": state.therapy?.understand,
    "#handsLaterView": state.revisit?.laterView,
    "#handsLaterLearning": state.revisit?.learning,
  };
  Object.entries(fields).forEach(([selector, savedValue]) => {
    if (savedValue !== undefined) $(selector).value = savedValue;
  });
  setRadio("hands-outcome", state.revisit?.outcome);
  setRadio("hands-confirmed", state.revisit?.confirmed);
}

$$("#waitingUrges button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const active = button.classList.toggle("is-active");
    button.setAttribute("aria-pressed", String(active));
  });
});

function updateNecessaryAction(choice) {
  const result = $("#necessaryActionResult");
  const waitButton = $("#responseHandsWait");
  if (choice === "Não") {
    result.textContent =
      "Então talvez eu possa sentir aquilo que estou sentindo sem transformar o sentimento imediatamente em ação.";
    waitButton.hidden = false;
  } else if (choice === "Ainda não sei") {
    result.textContent = "Posso esperar por mais realidade antes de decidir.";
    waitButton.hidden = true;
  } else if (choice === "Sim") {
    result.textContent =
      "Posso observar qual ação é realmente necessária e agir com respeito.";
    waitButton.hidden = true;
  } else {
    result.textContent = "";
    waitButton.hidden = true;
  }
}

$$('input[name="necessary-action"]').forEach((input) =>
  input.addEventListener("change", () => updateNecessaryAction(input.value))
);

$("#responseHandsWait").addEventListener("click", () => {
  const records = readJson(WAIT_KEY, []);
  const safeRecords = Array.isArray(records) ? records : [];
  safeRecords.push({
    createdAt: new Date().toISOString(),
    choice: "Posso esperar",
  });
  localStorage.setItem(WAIT_KEY, JSON.stringify(safeRecords));
  $("#necessaryActionResult").textContent =
    "Escolha registrada: posso esperar.";
});

$("#saveHandsTherapy").addEventListener("click", () => {
  saveState($("#handsTherapyMessage"), "Reflexões guardadas neste navegador.");
});

$("#saveHandsRevisit").addEventListener("click", () => {
  saveState($("#handsRevisitMessage"), "O que aconteceu depois foi guardado.");
});

restoreState();
updateNecessaryAction(selected("necessary-action"));
