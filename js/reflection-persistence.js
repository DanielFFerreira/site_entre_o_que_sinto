const PERSIST_PREFIX = "entre-o-que-sinto-field:";

const persistentFieldIds = [
  "urgeExpectation",
  "revoltExpectedAfter",
  "revoltKnow",
  "revoltFeel",
  "revoltSuspect",
  "revoltSays",
  "beforeOutburst",
  "expectedEvent",
  "didNotHappen",
  "angerGoal",
  "cantTake",
  "tiredOf",
  "wishThat",
  "angryBecause",
  "afraidOf",
  "hurtsMost",
  "wantedAnswer",
  "noAnswerFear",
  "nothingNow",
  "realNeedToSay",
  "hurtsNow",
  "distanceTired",
  "distanceFrustrated",
  "distanceDifficulty",
  "distanceDifferent",
  "distanceEnergy",
  "distanceContinueFeeling",
  "distanceAwayFeeling",
  "ifNotFollowed",
  "wantedRelationship",
  "expectedApproach",
  "enoughForMe",
  "onlyFriendship",
  "neverRelationship",
  "friendshipEnough",
  "silentExpectation",
  "uncertaintyLimit",
  "myLimit",
  "distanceWithoutReaction",
  "toContinue",
];

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function resizeAllTextareas(scope = document) {
  scope.querySelectorAll("textarea").forEach(autoResize);
}

function initPersistentField(field) {
  const key = PERSIST_PREFIX + field.id;
  const saved = localStorage.getItem(key);
  if (saved !== null) field.value = saved;

  let saveTimeout;
  field.addEventListener("input", () => {
    autoResize(field);
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem(key, field.value);
    }, 400);
  });

  const restoreButton = document.createElement("button");
  restoreButton.type = "button";
  restoreButton.className = "text-button field-restore-button";
  restoreButton.innerHTML =
    '<i class="ri-arrow-go-back-line" aria-hidden="true"></i> Restaurar reflexão inicial';
  restoreButton.addEventListener("click", () => {
    if (
      !window.confirm(
        "Restaurar a resposta inicial deste campo? Sua edição atual será substituída.",
      )
    ) {
      return;
    }
    field.value = field.defaultValue;
    localStorage.removeItem(key);
    autoResize(field);
  });
  field.insertAdjacentElement("afterend", restoreButton);
}

persistentFieldIds.forEach((id) => {
  const field = document.getElementById(id);
  if (field) initPersistentField(field);
});

document.addEventListener("input", (event) => {
  if (event.target.tagName === "TEXTAREA") autoResize(event.target);
});

const textareaObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      if (node.tagName === "TEXTAREA") autoResize(node);
      else if (node.querySelectorAll) resizeAllTextareas(node);
    });
  });
});
textareaObserver.observe(document.body, { childList: true, subtree: true });

resizeAllTextareas();
window.addEventListener("load", () => resizeAllTextareas());
