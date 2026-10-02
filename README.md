# Portfolio de Reda Diouri

Site statique en HTML, CSS et JavaScript. Aucun framework, dépendance de production ou compilation nécessaire.

## Lancer le site en local

Depuis ce dossier, avec Python installé :

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Ouvrir http://127.0.0.1:4173. Arrêter le serveur avec Ctrl+C.

## Comprendre les fichiers

- `index.html` contient les textes et la structure sémantique. Les projets sont des articles, les technologies des listes et chaque section possède un titre. Le contenu reste accessible sans JavaScript et peut être indexé directement.
- `styles.css` contient les couleurs partagées dans `:root`, la mise en page avec Grid et Flexbox, puis les adaptations tablette et mobile. Les media queries modifient la disposition suivant la largeur disponible. La préférence de réduction des animations est respectée.
- `script.js` ajoute le menu compact sur mobile. `aria-expanded` expose son état aux technologies d’assistance. Le panneau fermé est retiré de la navigation clavier. Échap ferme le menu et rend le focus au bouton. Un changement de largeur réinitialise son état.
- `assets/favicon.svg` est l’icône du portfolio. Les panneaux des projets sont des compositions typographiques, pas des captures des sites clients.

## Choix de la refonte

Justou et Maison Pardailhé occupent les deux premières fiches ; MyLaboAccess apparaît comme projet académique en pause. Les dates et la nature des contrats ne sont pas affichées dans les projets. Le Bachelor est présenté comme une formation en cours, sans revendiquer un titre obtenu.

Le formulaire précédent simulait un envoi : il est remplacé par des liens `mailto:` qui ouvrent le logiciel de messagerie du visiteur. Il n’y a pas de service d’envoi sur ce site.

Le contrôle « Et mon CV ? » utilise `details` et `summary` : le navigateur gère nativement l’ouverture, le clavier et l’état du message, même sans JavaScript. Aucun téléchargement fictif n’est proposé.

Les polices système évitent des requêtes externes. Aucun traceur ni service tiers n’est nécessaire pour afficher le portfolio. Les liens externes ouverts dans un nouvel onglet le signalent aux lecteurs d’écran.

## Modifier les contenus

Mettre à jour les textes et liens directement dans `index.html`. Les projets partagent leurs styles : modifier `.project-body` agit sur les deux fiches professionnelles, ce qui évite les duplications. Les URLs GitHub sont celles communiquées par Reda ; leur visibilité dépend des paramètres des dépôts.

Le site est publié sur https://redadiouri.github.io/portfolio-reda/. L’URL canonique et `og:url` utilisent cette adresse. Les ressources gardent des chemins relatifs pour fonctionner sous `/portfolio-reda/`. Le workflow GitHub Pages géré par GitHub est conservé, sans configuration de build ajoutée.

## Vérification avant publication

- Vérifier l’absence de débordement à 320, 375, 768, 1024 et 1440 px.
- Tester les liens de navigation, l’ouverture et la fermeture du menu, Échap et le focus clavier.
- Ouvrir le message CV ; vérifier les liens email et les destinations externes.
- Vérifier le contenu sans JavaScript et avec la réduction des mouvements activée.
- Contrôler les erreurs de console, les contrastes et la hiérarchie des titres.

Les contrôles automatisés complètent la lecture et les essais manuels ; ils ne constituent pas une certification d’accessibilité. Les mesures locales ne préjugent pas des performances de l’hébergement.

## Mini-jeu : Du bug au déploiement

Le mini-jeu facultatif se trouve après les projets. `game.js` gère un état local : étape courante, nombre de connexions correctes et résolution du bug. Il est isolé du script des animations pour faciliter la maintenance.

Les boutons natifs fonctionnent au clavier et au toucher. Une zone `role="status"` annonce les retours ; le focus passe au titre à chaque étape. Le déploiement est une simulation locale, sans requête réseau. Son minuteur est annulé lorsqu’on ferme ou réinitialise le jeu. Aucun résultat n’est collecté.

Pour le tester : essayer de mauvaises réponses, terminer les trois étapes, rejouer, puis fermer pendant la simulation et relancer. Vérifier également le parcours au clavier et sur un écran de 320 px.

## Identité REDA.EXE

REDA.EXE est une signature narrative ajoutée au design existant. Les couleurs, polices, cartes, animations et le mini-jeu restent ceux du portfolio. Les micro-labels complètent des titres lisibles, sans les remplacer.

- La version éditoriale se modifie dans `data-build` sur le `body` de `index.html` (par exemple `2026.10`). Mettre également à jour les deux textes de secours `Build …` pour les visites sans JavaScript. Cette version représente une édition du portfolio, pas une date de diplôme ou un âge. Le script synchronise les labels ; l’année de copyright reste indépendante.
- Le label d’accueil reçoit une animation de 800 ms lors de la première visite de la session. `sessionStorage` évite de la répéter. Aucun contenu n’attend cette animation ; si le stockage est bloqué ou les mouvements réduits, elle est ignorée.
- La fiche personnelle ouvre un élément HTML `dialog` : Échap ferme la fenêtre, le focus reste dans la fenêtre ouverte puis revient au bouton. Sans JavaScript, la fiche est lisible et le bouton d’ouverture reste masqué.
- Deux détails à découvrir : cette fenêtre et un message dans la console du navigateur. Aucune commande cachée ni suivi du visiteur.
- Le parcours présente des étapes sans dates : formation, projets professionnels, apprentissage continu. Il ne prétend pas reconstituer une chronologie non confirmée.

Après modification : tester les largeurs 375, 390, 430, 768, 1024 et 1440 px, les animations réduites, la fenêtre au clavier, la navigation et le jeu. Il n’y a pas de compilation : les fichiers statiques sont directement servis.
