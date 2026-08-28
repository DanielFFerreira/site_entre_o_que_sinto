const PKEY = "entre-o-que-sinto-patterns",
  DKEY = "entre-o-que-sinto-distance-decisions";
const $ = (s, c = document) => c.querySelector(s),
  $$ = (s, c = document) => [...c.querySelectorAll(s)];
const get = (k) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  },
  set = (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  radio = (n) => $(`input[name="${n}"]:checked`)?.value || "",
  esc = (v) => {
    const d = document.createElement("div");
    d.textContent = String(v ?? "");
    return d.innerHTML;
  };
["#clownMeaning", "#distanceExpectations"].forEach((s) =>
  $$(`${s} button`).forEach((b) => {
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.onclick = () => {
      const a = b.classList.toggle("is-active");
      b.setAttribute("aria-pressed", String(a));
    };
  })
);
$$(".distance-radio").forEach((g) => {
  g.innerHTML = ["Sim", "Não", "Não sei"].map((v) =>
    `<label><input type="radio" name="${g.dataset.name}" value="${v}"><span>${v}</span></label>`
  ).join("");
});
$$(".yes-no").forEach((g) => {
  g.innerHTML = ["Sim", "Não"].map((v) =>
    `<label><input type="radio" name="${g.dataset.name}" value="${v}"><span>${v}</span></label>`
  ).join("");
});
$("#distanceIntensity").oninput = () =>
  $("#distanceIntensityOutput").textContent = $("#distanceIntensity").value;
$("#patternDate").value = new Date().toISOString().slice(0, 10);
function renderPatterns() {
  const h = $("#patternHistory"), r = get(PKEY);
  h.innerHTML =
    r.slice().reverse().map((x) =>
      `<article class="message-entry" data-id="${x.id}"><strong>${
        esc(x.date)
      } — ${esc(x.initiative)}</strong><p>${
        esc(x.event)
      }</p><small>Reciprocidade: ${esc(x.reciprocity)} · ${
        esc(x.feeling)
      }</small><div class="message-entry-actions"><button class="text-button edit-pattern">Editar</button><button class="text-button delete-pattern">Excluir</button></div></article>`
    ).join("") ||
    '<div class="empty-message-history">Nenhuma observação ainda.</div>';
}
$("#patternForm").onsubmit = (e) => {
  e.preventDefault();
  const r = get(PKEY);
  r.push({
    id: crypto.randomUUID(),
    date: $("#patternDate").value,
    event: $("#patternEvent").value,
    initiative: radio("pattern-initiative"),
    reciprocity: radio("pattern-reciprocity"),
    feeling: $("#patternFeeling").value,
    meaning: $("#patternMeaning").value,
  });
  set(PKEY, r);
  e.target.reset();
  renderPatterns();
};
$("#patternHistory").onclick = (e) => {
  const c = e.target.closest(".message-entry");
  if (!c) return;
  if (
    e.target.closest(".delete-pattern") && confirm("Excluir esta observação?")
  ) {
    set(PKEY, get(PKEY).filter((x) => x.id !== c.dataset.id));
    renderPatterns();
  }
  if (e.target.closest(".edit-pattern")) {
    const r = get(PKEY),
      x = r.find((x) => x.id === c.dataset.id),
      v = prompt("Editar o que aconteceu:", x.event);
    if (v !== null) {
      x.event = v;
      set(PKEY, r);
      renderPatterns();
    }
  }
};
function renderDecisions() {
  const h = $("#distanceDecisionHistory"), r = get(DKEY);
  h.innerHTML =
    r.slice().reverse().map((x) =>
      `<article class="message-entry" data-id="${x.id}"><strong>${
        esc(x.choice)
      }</strong><p>${esc(x.why)}</p><small>${
        new Date(x.createdAt).toLocaleString("pt-BR")
      }</small><div class="message-entry-actions"><button class="text-button revisit-distance">Revisitar</button><button class="text-button delete-distance">Excluir</button></div><form class="distance-revisit" hidden><label>Ainda quero a mesma coisa?<select name="same"><option>Sim</option><option>Parcialmente</option><option>Não</option><option>Não sei</option></select></label><label>O que mudou e o que agora parece mais respeitoso comigo?<textarea name="review">${
        esc(x.review || "")
      }</textarea></label><button class="button button-primary">Guardar revisão</button></form></article>`
    ).join("") ||
    '<div class="empty-message-history">Nenhuma decisão registrada.</div>';
}
$("#distanceDecisionForm").onsubmit = (e) => {
  e.preventDefault();
  const r = get(DKEY);
  r.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    choice: radio("distance-choice"),
    why: $("#distanceWhy").value,
    calm: radio("distance-calm"),
    talkFirst: radio("distance-talk-first"),
  });
  set(DKEY, r);
  renderDecisions();
};
$("#distanceDecisionHistory").onclick = (e) => {
  const c = e.target.closest(".message-entry");
  if (!c) return;
  if (
    e.target.closest(".delete-distance") && confirm("Excluir esta decisão?")
  ) {
    set(DKEY, get(DKEY).filter((x) => x.id !== c.dataset.id));
    renderDecisions();
  }
  if (e.target.closest(".revisit-distance")) {
    $(".distance-revisit", c).hidden = !$(".distance-revisit", c).hidden;
  }
};
$("#distanceDecisionHistory").onsubmit = (e) => {
  if (!e.target.matches(".distance-revisit")) return;
  e.preventDefault();
  const c = e.target.closest(".message-entry"), d = new FormData(e.target);
  set(
    DKEY,
    get(DKEY).map((x) =>
      x.id === c.dataset.id
        ? { ...x, same: d.get("same"), review: d.get("review") }
        : x
    ),
  );
  renderDecisions();
};
renderPatterns();
renderDecisions();
