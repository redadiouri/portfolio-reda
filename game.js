// An isolated, local game: no account, score collection or actual deployment.
(() => {
  const start = document.getElementById("game-start");
  const board = document.getElementById("game-board");
  const content = document.getElementById("game-content");
  const feedback = document.getElementById("game-feedback");
  const steps = [...document.querySelectorAll(".game-steps li")];
  let stage = 0;
  let connected = 0;
  let solved = false;
  let deploymentTimer = null;

  const icon = (type) => {
    const paths = {
      screen:
        '<rect x="5" y="8" width="54" height="38" rx="4"/><path d="M22 56h20M32 46v10M5 18h54"/><path d="M13 29h17M13 36h28"/>',
      server:
        '<rect x="10" y="6" width="44" height="15" rx="3"/><rect x="10" y="25" width="44" height="15" rx="3"/><rect x="10" y="44" width="44" height="15" rx="3"/><path d="M17 13h3M17 32h3M17 51h3M28 13h18M28 32h18M28 51h18"/>',
      data: '<ellipse cx="32" cy="12" rx="23" ry="8"/><path d="M9 12v38c0 11 46 11 46 0V12M9 30c0 11 46 11 46 0"/>',
      box: '<path d="M8 18l24-12 24 12v30L32 60 8 48zM8 18l24 12 24-12M32 30v30M20 12l24 12v13"/>',
    };
    return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]}</svg>`;
  };
  const shop = (online = false) =>
    `<div class="demo-shop ${online ? "online" : ""}"><div class="demo-browser"><i></i><i></i><i></i><span>boutique.demo / panier</span></div><div class="demo-product">${icon("box")}<div><strong>Le coffret découverte</strong><p>Produit fictif · 12 € / unité</p></div></div><div class="demo-quantity"><span>Quantité</span><strong>3 articles</strong></div><div class="demo-total"><span>Total</span><output>${online ? "36" : "15"} €</output></div><p class="demo-health">${online ? "Calcul vérifié · Application disponible" : "Anomalie : le total attendu est 36 €"}</p></div>`;
  function stopDeployment() {
    clearInterval(deploymentTimer);
    deploymentTimer = null;
  }
  function showStage(nextStage) {
    stopDeployment();
    stage = nextStage;
    feedback.textContent = "";
    steps.forEach((element, index) => {
      element.classList.toggle("is-complete", index < stage);
      if (index === stage) element.setAttribute("aria-current", "step");
      else element.removeAttribute("aria-current");
    });
    if (stage === 0) {
      connected = 0;
      content.innerHTML = `<h3 tabindex="-1">1. Faites circuler une demande</h3>
        <p>Un visiteur consulte un produit. Sélectionnez les trois éléments dans l’ordre de sa demande, du clic aux données.</p>
        <div class="game-route" aria-label="Votre parcours"><span>Départ : le clic du visiteur</span></div>
        <div class="game-options circuit" data-connected="0">
          <button type="button" data-node="0">${icon("screen")}<strong>Interface</strong><small>Le clic du visiteur</small><span class="node-led">Hors connexion</span></button>
          <div class="circuit-wire" aria-hidden="true"><i></i></div>
          <button type="button" data-node="1">${icon("server")}<strong>Serveur</strong><small>Traite la demande</small><span class="node-led">En attente</span></button>
          <div class="circuit-wire" aria-hidden="true"><i></i></div>
          <button type="button" data-node="2">${icon("data")}<strong>Base de données</strong><small>Conserve les produits</small><span class="node-led">En attente</span></button>
        </div>
        <details class="game-hint"><summary>Un indice ?</summary><p>Le visiteur utilise l’interface. Elle contacte le serveur, qui interroge la base de données.</p></details>
        <button type="button" class="button button-dark game-next" data-next hidden>Passer au bug →</button>`;
    } else if (stage === 1) {
      solved = false;
      content.innerHTML = `<h3 tabindex="-1">2. Retrouvez la ligne qui pose problème</h3>
        <p>Un article coûte 12 €. Le client en commande 3 : le total devrait être <strong>36 €</strong>. Sélectionnez la ligne à corriger.</p>
        <div class="debug-workspace"><div class="debug-editor"><div class="editor-tab">panier.js <span>1 bug</span></div><div class="game-code" aria-label="Code JavaScript à examiner">
          <button type="button" data-line="1"><span aria-hidden="true">01</span><code>const prix = 12;</code></button>
          <button type="button" data-line="2"><span aria-hidden="true">02</span><code>const quantite = 3;</code></button>
          <button type="button" data-line="3"><span aria-hidden="true">03</span><code>const total = prix + quantite;</code></button>
        </div><div class="operator-picker" hidden><p>Remplacez l’opérateur du calcul :</p><div><button type="button" data-operator="-" aria-label="Soustraire">−</button><button type="button" data-operator="*" aria-label="Multiplier">×</button><button type="button" data-operator="/" aria-label="Diviser">÷</button></div></div></div>${shop()}</div>
        <details class="game-hint"><summary>Un indice ?</summary><p>Pour trois articles au même prix, faut-il additionner le prix et la quantité, ou les multiplier ? En JavaScript, * sert à multiplier.</p></details>
        <button type="button" class="button button-dark game-next" data-next hidden>Préparer le déploiement →</button>`;
    } else if (stage === 2) {
      content.innerHTML = `<h3 tabindex="-1">3. Prêt pour la mise en ligne ?</h3>
        <p>Le parcours est relié et le calcul corrigé. Lancez cette <strong>simulation</strong> pour terminer : aucun site ni serveur réel ne sera modifié.</p>
        <div class="deployment-scene"><div class="deploy-machine">${icon("server")}<span>Local</span></div><div class="deploy-bridge" aria-hidden="true"><i></i><i></i><i></i></div><div class="deploy-machine deploy-cloud">${icon("screen")}<span>En attente de publication</span></div></div><ul class="deploy-checks"><li>✓ Interface → serveur → base de données</li><li>✓ Calcul corrigé : 12 × 3 = 36 €</li></ul>
        <button type="button" class="button button-dark" data-deploy>Lancer le déploiement simulé ↗</button>
        <div class="deploy-terminal" hidden><p>En attente…</p><progress max="3" value="0" aria-label="Progression du déploiement simulé"></progress></div>`;
    } else {
      content.innerHTML = `<div class="game-win">${shop(true)}<span class="game-success-icon" aria-hidden="true">✓</span><p class="eyebrow">Application en ligne · Simulation terminée</p><h3 tabindex="-1">Déploiement réussi.</h3><p>Vous avez relié l’application, corrigé un calcul et suivi sa mise en ligne.<br>On travaille ensemble sur le prochain projet ?</p><div class="actions"><a class="button button-dark" href="#contact">Me contacter ↗</a><button type="button" class="game-quiet" data-restart>Rejouer</button></div></div>`;
    }
    content.querySelector("h3").focus();
  }

  start.hidden = false;
  start.addEventListener("click", () => {
    board.hidden = false;
    start.hidden = true;
    showStage(0);
  });
  document.getElementById("game-close").addEventListener("click", () => {
    stopDeployment();
    board.hidden = true;
    start.hidden = false;
    start.focus({ preventScroll: true });
  });
  content.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.hasAttribute("data-restart")) {
      showStage(0);
      return;
    }
    if (button.hasAttribute("data-next")) {
      showStage(stage + 1);
      return;
    }
    if (stage === 0 && button.hasAttribute("data-node")) {
      if (Number(button.dataset.node) !== connected) {
        feedback.textContent =
          connected === 0
            ? "Commencez par ce que le visiteur voit à l’écran. Réessayez !"
            : "Pas encore : suivez le chemin indiqué par le rôle de chaque élément.";
        return;
      }
      const label = button.querySelector("strong").textContent;
      button.disabled = true;
      button.classList.add("is-correct");
      const item = document.createElement("span");
      item.textContent = `→ ${label}`;
      content.querySelector(".game-route").append(item);
      connected++;
      button.querySelector(".node-led").textContent = "Connecté";
      content.querySelector(".circuit").dataset.connected = connected;
      content
        .querySelectorAll(".circuit-wire")
        .forEach((wire, index) =>
          wire.classList.toggle("live", index < connected - 1),
        );
      feedback.textContent =
        connected === 3
          ? "Bien joué ! La demande va de l’interface au serveur, puis à la base de données. La réponse revient ensuite au visiteur."
          : `${label} connecté. Quel est l’élément suivant ?`;
      if (connected === 3) {
        const next = content.querySelector("[data-next]");
        next.hidden = false;
        next.focus({ preventScroll: true });
      } else
        content
          .querySelector(".game-options button:not(:disabled)")
          .focus({ preventScroll: true });
    }
    if (stage === 1 && button.hasAttribute("data-line") && !solved) {
      if (button.dataset.line !== "3") {
        feedback.textContent =
          "Cette valeur est correcte. Le problème se trouve dans le calcul du total. Essayez une autre ligne.";
        return;
      }
      content.querySelector(".operator-picker").hidden = false;
      feedback.textContent =
        "Vous avez trouvé la ligne. Choisissez maintenant le bon opérateur et observez le panier.";
      content.querySelector("[data-operator]").focus({ preventScroll: true });
      return;
    }
    if (stage === 1 && button.hasAttribute("data-operator") && !solved) {
      const operator = button.dataset.operator;
      const total = operator === "*" ? 36 : operator === "-" ? 9 : 4;
      content.querySelector(".demo-total output").textContent = `${total} €`;
      const line = content.querySelector('[data-line="3"]');
      line.querySelector("code").textContent =
        `const total = prix ${operator} quantite;`;
      if (operator !== "*") {
        feedback.textContent = `Le panier affiche ${total} €, pas 36 €. Essayez un autre opérateur.`;
        return;
      }
      solved = true;
      content.querySelector(".demo-shop").classList.add("online");
      content.querySelector(".demo-health").textContent =
        "Calcul vérifié : 3 articles × 12 € = 36 €";
      content.querySelector(".editor-tab span").textContent = "Corrigé";
      content.querySelectorAll("[data-operator]").forEach((option) => {
        option.disabled = true;
      });
      line.classList.add("is-correct");
      line.querySelector("code").textContent = "const total = prix * quantite;";
      button.classList.add("is-correct");
      content.querySelectorAll("[data-line]").forEach((line) => {
        line.disabled = true;
      });
      feedback.textContent =
        "Exact ! + donnait 15. Avec la multiplication *, 12 × 3 donne bien 36 €.";
      const next = content.querySelector("[data-next]");
      next.hidden = false;
      next.focus({ preventScroll: true });
    }
    if (stage === 2 && button.hasAttribute("data-deploy")) {
      button.disabled = true;
      const terminal = content.querySelector(".deploy-terminal");
      terminal.hidden = false;
      content.querySelector(".deployment-scene").classList.add("deploying");
      content.querySelector(".deploy-cloud span").textContent =
        "Publication en cours";
      const messages = [
        "Vérification du calcul…",
        "Préparation de l’application…",
        "Mise en ligne simulée…",
      ];
      let tick = 0;
      terminal.querySelector("p").textContent = messages[0];
      feedback.textContent = "Déploiement simulé en cours.";
      deploymentTimer = setInterval(() => {
        tick++;
        terminal.querySelector("progress").value = tick;
        if (tick < messages.length)
          terminal.querySelector("p").textContent = messages[tick];
        else showStage(3);
      }, 850);
    }
  });
})();
