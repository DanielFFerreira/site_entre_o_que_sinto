const DRAFT_KEY = "entre-o-que-sinto-unsent";
const RECORDS_KEY = "entre-o-que-sinto-revolt-records";
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const read = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? f;
  } catch {
    return f;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = (v) => {
  const d = document.createElement("div");
  d.textContent = String(v ?? "");
  return d.innerHTML;
};
const radio = (n) => $(`input[name="${n}"]:checked`)?.value || "";
function choices(selector, single = false) {
  $$(selector + " button").forEach((b) => {
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      if (single) {
        $$(selector + " button").forEach((x) => {
          x.classList.remove("is-active");
          x.setAttribute("aria-pressed", "false");
        });
      }
      const a = b.classList.toggle("is-active");
      b.setAttribute("aria-pressed", String(a));
    });
  });
}
choices("#revoltImpulses");
choices("#outburstFeelings");
choices("#angerWants");
choices("#angerTargets");
choices("#revoltEmotion", true);
[
  ["#outburstIntensity", "#outburstIntensityOutput"],
  ["#laterRevolt", "#laterRevoltOutput"],
  ["#decisionIntensity", "#decisionIntensityOutput"],
  ["#revoltIntensity", "#revoltIntensityOutput"],
].forEach(([a, b]) =>
  $(a).addEventListener("input", () => $(b).textContent = $(a).value)
);
$$(".decision-radio").forEach((group) => {
  const n = group.dataset.name;
  group.innerHTML = ["Sim", "Não", "Não sei"].map((v) =>
    `<label><input type="radio" name="${n}" value="${v}"><span>${v}</span></label>`
  ).join("");
});
$$('input[name="major-decision"]').forEach((i) =>
  i.addEventListener(
    "change",
    () => $("#majorDecisionFields").hidden = i.value !== "Sim",
  )
);
$$('input[name="impulsive-now"]').forEach((i) =>
  i.addEventListener(
    "change",
    () => $("#impulsiveFields").hidden = i.value !== "Sim",
  )
);
function draft() {
  return {
    text: $("#unsentText").value,
    separation: {
      fact: $("#unsentFact").value,
      feeling: $("#unsentFeeling").value,
      interpretation: $("#unsentInterpretation").value,
      suspicion: $("#unsentSuspicion").value,
      fear: $("#unsentFear").value,
      need: $("#unsentNeed").value,
      heat: $("#unsentHeat").value,
    },
    revisit: {
      intensity: $("#laterRevolt").value,
      agree: radio("still-agree"),
      send: radio("still-send"),
      changed: $("#unsentChanged").value,
    },
    updatedAt: new Date().toISOString(),
  };
}
function saveDraft(msg) {
  write(DRAFT_KEY, draft());
  $("#unsentMessage").textContent = msg;
  $("#separationStage").hidden = false;
}
$("#saveUnsent").addEventListener(
  "click",
  () => saveDraft("Desabafo guardado. Ele não foi enviado."),
);
$("#saveSeparation").addEventListener(
  "click",
  () => saveDraft("Separação guardada."),
);
$("#saveUnsentRevisit").addEventListener(
  "click",
  () => saveDraft("Revisão guardada."),
);
const old = read(DRAFT_KEY, null);
if (old) {
  $("#unsentText").value = old.text || "";
  $("#separationStage").hidden = false;
  const map = {
    "#unsentFact": old.separation?.fact,
    "#unsentFeeling": old.separation?.feeling,
    "#unsentInterpretation": old.separation?.interpretation,
    "#unsentSuspicion": old.separation?.suspicion,
    "#unsentFear": old.separation?.fear,
    "#unsentNeed": old.separation?.need,
    "#unsentHeat": old.separation?.heat,
    "#unsentChanged": old.revisit?.changed,
  };
  Object.entries(map).forEach(([s, v]) => {
    if (v) $(s).value = v;
  });
  $("#laterRevolt").value = old.revisit?.intensity || 0;
  $("#laterRevoltOutput").textContent = $("#laterRevolt").value;
  ["still-agree", "still-send"].forEach((n) => {
    const v = old.revisit?.[n === "still-agree" ? "agree" : "send"];
    $$(`input[name="${n}"]`).forEach((i) => i.checked = i.value === v);
  });
}
const form = $("#revoltForm"), history = $("#revoltHistory");
function records() {
  const r = read(RECORDS_KEY, []);
  return Array.isArray(r) ? r : [];
}
function render() {
  const r = records();
  history.innerHTML = r.length
    ? r.slice().reverse().map((x) =>
      `<article class="message-entry" data-id="${x.id}"><div class="message-entry-head"><div><h4>${
        esc(x.situation)
      }</h4><span>${esc(x.emotion)} · ${x.intensity}/10</span></div><time>${
        new Date(x.createdAt).toLocaleString("pt-BR")
      }</time></div><div class="message-entry-summary"><div>${
        esc(x.happened)
      }</div><div><strong>Impulso:</strong> ${
        esc(x.urge)
      }</div><div><strong>O que fiz:</strong> ${
        esc(x.did)
      }</div><div><strong>Revisão:</strong> ${
        esc(x.later?.confirmed || "Ainda não revisitado")
      }</div></div><div class="message-entry-actions"><button class="text-button edit-revolt" type="button">Editar</button><button class="text-button revisit-revolt" type="button">Revisitar</button><button class="text-button delete-revolt" type="button">Excluir</button></div><form class="revolt-later" hidden><label>O que aconteceu algumas horas ou dias depois?<textarea name="laterEvent">${
        esc(x.later?.event)
      }</textarea></label><label>Minha interpretação inicial estava correta?<select name="confirmed"><option>${
        esc(x.later?.confirmed || "Ainda não sei")
      }</option><option>Sim</option><option>Parcialmente</option><option>Não</option><option>Ainda não sei</option></select></label><label>Aquilo que eu queria fazer teria ajudado?<select name="helped"><option>${
        esc(x.later?.helped || "Não sei")
      }</option><option>Sim</option><option>Talvez</option><option>Não</option><option>Não sei</option></select></label><label>Estou feliz por ter esperado?<select name="glad"><option>${
        esc(x.later?.glad || "Indiferente")
      }</option><option>Sim</option><option>Não</option><option>Indiferente</option></select></label><label>Existe algo que ainda preciso conversar?<textarea name="talk">${
        esc(x.later?.talk)
      }</textarea></label><button class="button button-primary">Guardar revisão</button></form></article>`
    ).join("")
    : '<div class="empty-message-history">Nenhum momento registrado ainda.</div>';
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const emotion = $("#revoltEmotion .is-active")?.textContent ||
    "Não informado";
  const r = records();
  r.push({
    id: crypto.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    situation: $("#revoltSituation").value,
    emotion,
    intensity: +$("#revoltIntensity").value,
    happened: $("#revoltHappened").value,
    thought: $("#revoltThought").value,
    urge: $("#revoltUrge").value,
    did: $("#revoltDid").value,
    impulsive: radio("impulsive-now"),
    impulsiveWhat: $("#impulsiveWhat").value,
    later: null,
  });
  write(RECORDS_KEY, r);
  form.reset();
  $("#revoltFormMessage").textContent = "Momento guardado.";
  render();
});
history.addEventListener("click", (e) => {
  const card = e.target.closest(".message-entry");
  if (!card) return;
  if (e.target.closest(".delete-revolt")) {
    if (confirm("Deseja excluir este registro?")) {
      write(
        RECORDS_KEY,
        records().filter((x) => x.id !== card.dataset.id),
      );
      render();
    }
  }
  if (e.target.closest(".revisit-revolt")) {
    $(".revolt-later", card).hidden = !$(".revolt-later", card).hidden;
  }
  if (e.target.closest(".edit-revolt")) {
    const x = records().find((x) => x.id === card.dataset.id);
    const updated = prompt("Edite a situação:", x.situation);
    if (updated !== null) {
      x.situation = updated;
      write(RECORDS_KEY, records().map((y) => y.id === x.id ? x : y));
      render();
    }
  }
});
history.addEventListener("submit", (e) => {
  if (!e.target.matches(".revolt-later")) return;
  e.preventDefault();
  const card = e.target.closest(".message-entry"),
    data = new FormData(e.target);
  write(
    RECORDS_KEY,
    records().map((x) =>
      x.id === card.dataset.id
        ? {
          ...x,
          later: {
            event: data.get("laterEvent"),
            confirmed: data.get("confirmed"),
            helped: data.get("helped"),
            glad: data.get("glad"),
            talk: data.get("talk"),
          },
        }
        : x
    ),
  );
  render();
});
render();
