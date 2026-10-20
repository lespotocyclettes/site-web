# Mini-app de gestion des vélos — Les Poto'Cyclettes

*Plan v3 — juillet 2026, amendé le 21/10/2026*

> **Amendements d'octobre 2026.** Le reste du document est celui de juillet.
>
> - **Suivi atelier** : il vit au verso de la fiche vélo, pas au recto. Le recto identifie le vélo.
> - **Diagnostic** : il ne périme pas forcément. Il se fait au fil de l'eau, quand on a le temps.
> - **État mécanique** : ce n'est pas un champ en base. Il vit au verso de la fiche vélo.
> - **Outillage** : Vite est retenu pour la mini-app. La fondation CSS, elle, tourne sans build.
> - **Composants** : la piste Shoelace est abandonnée. Les chips seront un toggle-group.

---

## Introduction

### Contexte

Les Poto'Cyclettes est un atelier d'autoréparation de vélos 100 % bénévole basé à Mulhouse. L'association récupère des vélos en don, les répare et les revend (ou les démonte pour pièces). Un process de gestion des vélos a été mis en place fin 2025, articulé autour de deux artefacts papier (fiche don, fiche vélo plastifiée A5 recto-verso avec statut par trombone) et d'une base de données Teable, alimentée par des formulaires et accessible par QR code depuis les fiches.

Le papier a fait ses preuves ; le maillon numérique a cassé rapidement : les formulaires Teable contenant un champ lié vers une table d'un autre space renvoient une erreur 500 ([teable#2543](https://github.com/teableio/teable/issues/2543)). État des lieux : ~30 fiches plastifiées accrochées et partiellement saisies, 10 vélos en base avant le bug, dons et ventes saisis « à l'arrache », pas de suivi des sorties, et un stock historique (2015-2024) largement anonyme.

### Objectifs (par ordre de priorité)

1. **Historique juridique** — savoir d'où vient et où va chaque vélo (donateur, acheteur, signatures). *Couvert par le papier, la base n'en est qu'une copie de confort.* La fiche don archivée est la source de vérité légale ; la **référence** écrite sur la fiche don ET la fiche vélo fait la jointure.
2. **État des stocks** — répondre à « on a un vélo enfant ? un VTT ? » et savoir quoi sortir en priorité pour réparer. *C'est le besoin que la base doit servir en premier.*
3. **Suivi atelier** — voir d'un coup d'œil ce qu'il y a à faire sur un vélo (verso de la fiche plastifiée). *Fonctionne déjà ; il manque des fiches imprimées.*
4. **Vitrine web** — les vélos « prêts à la vente » remontent sur le site via une vue Teable filtrable avec photos. *Bonus assumé : si ce n'est plus fait, tant pis.*

### Problèmes à résoudre

- **Formulaires Teable cassés** : les 4 actions (enregistrer, prêt à la vente, démonté/détruit, sortie de stock) sont inutilisables en l'état.
- **Saisie fastidieuse** : photo picker sans accès caméra, combobox pénibles sur mobile, nombreux champs optionnels, référence AAMMJJ·NN saisie 100 % manuellement.
- **Rattrapage** : un stock important de vélos anonymes ou sans diagnostic ; un diagnostic complet prend 10-15 min, intenable en masse.
- **Pérennité** : l'outil doit rester maintenable si son auteur quitte l'association (principe : « outils modifiables sans mon intervention »), nuancé par la présence d'un second dev bénévole.

### Ce qu'on fait

- Une **mini-app de gestion de stock** : flux d'entrée d'un vélo, écran de recherche, fiche vélo à l'écran avec actions (prêt à la vente, démonté/détruit, sortie de stock).
- Un **relais PHP** (mu-plugin WordPress) qui garde les secrets côté serveur, génère les références, valide les transitions d'état et fait proxy vers l'API Teable.
- Une **session d'inventaire éclair** à date fixe pour rattraper le stock (inventorier ≠ diagnostiquer : 2 min/vélo suffisent pour le besoin stocks).
- En bonus opportuniste : le **préremplissage des champs par analyse de la photo** (VLM), pour passer la saisie sous la minute.

### Ce qu'on ne fait pas

- **Pas de table de mouvements** (comptabilité en partie double des stocks) : 1 vélo = 1 ligne, un vélo sort une fois. La simplicité prime.
- **Pas de diagnostic exhaustif du stock dormant** : le diagnostic approfondi se fait au fil de l'eau, quand on a le temps.
- **Pas d'inférence sur la taille de roue ni l'état mécanique** : non fiable depuis une photo. La taille de roue reste saisie à la main, l'état mécanique vit au verso de la fiche vélo.
- **Pas de rattrapage rétroactif détaillé** de l'historique 2015-2024 au niveau du nouveau process : enregistrement minimal.
- **Pas de galerie photos sophistiquée** : une photo principale, les suivantes en upload simple.

### Méthodologie et principes

- **Dégradation gracieuse** : chaque phase livre quelque chose d'utilisable même si la suivante n'arrive jamais. Le papier reste le fallback ultime — il a déjà prouvé qu'il survit à tout.
- **L'IA est un accélérateur, jamais un péage** : tout échec d'inférence dégrade silencieusement vers la saisie manuelle. Critère de réussite de la phase inférence : si elle meurt, personne ne s'en aperçoit.
- **L'utilisateur a toujours raison** : l'inférence n'écrase jamais une saisie humaine.
- **Bus factor ≥ 2** : co-signature des choix techniques avec le second dev, code lisible en entier en un temps borné, README de transmission, portes de sortie documentées pour chaque dépendance non standard.
- **Timebox exécutoire** : la session d'inventaire a une date au calendrier, pas une condition de maturité de l'outil. L'inventaire part avec l'outil dans l'état où il est.

### Décisions actées

| Sujet | Décision |
|---|---|
| Modèle de données | 1 vélo = 1 ligne. Machine à états : `en stock → prêt à la vente → sorti \| démonté`. Sortie = champs sur la ligne (date_sortie, acheteur, prix, type vente/don). |
| Schéma | Séparer les facettes de `type_velo` (type / public / genre) **avant** d'écrire l'UI. |
| Flux d'entrée | Séquentiel : photo (bypassable) → inférence (bloquante, 2-3 s) → vérification/saisie → submit → confirmation avec référence à recopier sur la fiche. |
| Concurrence | État par champ `{value, source: 'user' \| 'ai' \| null}`. L'inférence n'écrit que si `source !== 'user'`. Brouillon persisté sous clé stable, indépendante des params d'inférence, merge au render. |
| Référence | Générée côté serveur au submit (`max(jour) + 1`), jamais saisie — sauf mode « à rebours » explicite. `date_entree` toujours dérivée de la référence, jamais saisie. |
| Photos | La première est obligatoire (sauf bypass) et sert à l'inférence ; les suivantes optionnelles en upload simple. En cas de bypass photo : marque/modèle/couleur deviennent requis pour l'identification. |
| Validation | Rien d'autre n'est obligatoire — ne jamais bloquer une saisie dans l'atelier. |
| UI mobile | Datalist natif (marque, modèle, couleur — suggestions depuis la base), chips tapables (type, public, taille, triage), sous forme de toggle-group ; elles peuvent venir après la fondation. Pas de combobox. |
| Composants | Pas de lib de composants lourde. On tranchera au premier besoin réel. |
| Outillage | Vite retenu en octobre 2026, à co-signer avec le 2ᵉ dev. Le principe de transmission est tenu autrement : la fondation CSS n'en dépend pas et tourne sans build, son styleguide s'ouvre d'un double-clic. |
| unreel | Autorisé sous conditions : dogfooding assumé, contenu au flux d'entrée uniquement, co-signé par le 2ᵉ dev, porte de sortie documentée (~30 lignes de localStorage équivalentes). Le core étant framework-agnostique, un **adapteur Preact** est envisageable — unreel n'impose donc ni React ni un build, et reste compatible avec la piste no-build. |
| Sécurité | Token Teable et clé VLM en `wp-config.php`, secret partagé en header vérifié dans `permission_callback`, htaccess (Basic Auth) sur la page. Le htaccess seul ne protège **pas** `/wp-json/` — d'où le secret en header. |
| Vitrine web | Vue Teable filtrée sur « prêt à la vente », aucune ligne de code dédiée. |

---

## Le plan

### Phase 0 — Vérifications préalables *(une soirée, à faire en premier)*

1. **Tester le contournement same-space Teable** : rapatrier les tables liées dans le même space et vérifier si les formulaires natifs remarchent. Même si la mini-app se fait, ça rétablit le fallback natif.
2. **Vérifier l'hébergement** : Apache ou nginx (sort du htaccess), version PHP, accès FTP/SSH pour déposer le mu-plugin.
3. **Recette curl de l'API Teable** : création d'enregistrement, update, upload de photo, requête du compteur du jour. Une heure pour tout valider de bout en bout.
4. **📅 Fixer la date de la session d'inventaire — maintenant.** Horizon 6 à 8 semaines, mobilisation des bénévoles lancée. C'est la seule action qui rend le timebox réel.

### Phase 1 — Le relais PHP *(le socle)*

Mu-plugin unique `potocyclettes-teable-relay.php` dans `wp-content/mu-plugins/`. Routes REST :

- **`POST /velo`** — création. Deux modes :
  - *auto* (défaut) : référence = `max(jour) + 1` côté serveur, **références manuelles incluses dans le max** ;
  - *à rebours* : référence fournie → validation du format (regexp AAMMJJ·NN) + **unicité** (refus propre : « 260707.03 existe déjà »), `date_entree` dérivée de la référence.
- **`PATCH /velo/{ref}`** — transitions de statut et champs de sortie. Une seule route pour les 3 actions, le payload porte la transition. Transitions validées côté serveur (pas de `sorti → en stock` accidentel).
- **`GET /velos?q=`** — recherche (référence, marque, statut), pagination simple, cache court.
- **`POST /velo/photo`** — upload (ou fusionné dans les routes précédentes selon l'API Teable).
- **`GET /suggestions`** — valeurs existantes pour les datalists, cache transient 1 h.
- **`POST /velo/inference`** — **squelette dès maintenant** : la route existe, retourne `501` ou un mock derrière une constante `wp-config.php`. Le contrat JSON `{type, couleurs, marque, modele}` est final dès cette phase ; le front se code contre lui.

**Livrable : toute la surface API testable au curl, indépendamment de toute UI.**

### Phase 2 — La mini-app

- **Écran recherche** : champ texte (référence/marque) + chips de statut + grille de vignettes photo. Sert aussi d'inventaire visuel de l'atelier.
- **Fiche vélo** : photo, champs, actions selon le statut courant — « Prêt à la vente » et « Démonté/détruit » en tap + confirmation ; « Sortie de stock » ouvre le mini-formulaire (acheteur, prix, vente/don), miroir légal de la fiche don.
- **Flux d'entrée** : le séquentiel acté. Datalist (marque/modèle/couleur), chips (type/public/taille/triage), `<input capture="environment">` + resize canvas (~1600 px), champs `source: 'ai'` visuellement distincts jusqu'à confirmation par le bénévole.
- **Saisie à rebours** : champ référence masqué derrière un toggle « ce vélo a déjà un numéro » — affordance d'exception, pas un champ ouvert.
- **Dégradations silencieuses** : pas de photo → formulaire vide ; inférence KO → formulaire vide + message discret ; submit KO → valeurs conservées + retry.
- **Cycle de vie du brouillon** : meurt au submit confirmé ; bouton « abandonner ce brouillon » ; TTL de sécurité (24 h).

**Deux tests d'intégration nommés, non négociables :**

1. *Reprendre la photo ne perd jamais « peugeot ».*
2. *Un submit réussi ne laisse jamais un brouillon fantôme qui contamine le vélo suivant.*

**Livrable : les 4 actions Teable cassées remplacées ; saisie complète d'un don au téléphone en moins de 2 minutes, photo comprise.**

### Phase 3 — Session d'inventaire *(date fixée en phase 0)*

- Lot de fiches plastifiées imprimé **avant** la session.
- Règle de référence pour le stock ancien : date du jour d'inventaire, sauf référence papier existante → saisie à rebours.
- Périmètre par vélo : référence, photo, type, triage grossier (vendre / à réparer / à démonter) — **2 min/vélo, inventorier ≠ diagnostiquer**. Le diagnostic approfondi (10-15 min) reste au fil de l'eau, à la sortie de réparation.
- Trois scénarios selon l'état de l'outil au jour J, tous acceptables :
  - app + inférence : ~30 s/vélo 🍾
  - app sans inférence : ~2 min/vélo
  - app pas prête : fiches papier + référence au marqueur, saisie à rebours ensuite — *le filet de sécurité est spécifié, c'est lui qui rend le timebox tenable.*

**Livrable : la base répond enfin à « on a un vélo enfant en stock ? » et « quoi réparer en priorité ? ».**

### Phase 4 — Inférence photo *(bonus opportuniste)*

- Backend réel de `/velo/inference` : photo → VLM (Claude ou équivalent) → JSON `{type, couleurs, marque, modele}`, `null` explicitement autorisé, prompt gérant le cas « repeint / marque illisible » (ne jamais halluciner un Peugeot par vraisemblance statistique).
- Travail purement serveur — potentiellement une soirée. **Fenêtre opportuniste** : si les phases 1-2 finissent avant la date d'inventaire, cette soirée passe devant — c'est sur 100 vélos d'affilée que les 90 secondes gagnées par vélo deviennent des heures. Sinon, elle sert au fil de l'eau après.
- Kill switch en `wp-config.php`, en place depuis la phase 1.
- Hors périmètre, assumé humain : taille de roue, état mécanique.
- Coût estimé : de l'ordre du centime par photo — quelques euros par an aux volumes de l'association.

**Critère de réussite : si cette phase meurt, personne ne s'en aperçoit.**

### Transversal — Transmission et pari unreel

- **Consulter le 2ᵉ dev avant la phase 2** : le choix unreel/pas-unreel se co-signe, c'est lui qui hérite de la dette. Un froncement de sourcils en review est une donnée.
- **Issue unreel à ouvrir immédiatement** : la `persistenceKey` sur mesure au `run()` est soit non documentée, soit perdue en route. Premier livrable du dogfooding, avant la première ligne du projet.
- Si unreel est retenu : contenu au **flux d'entrée uniquement** (le seul séquentiel), le reste de la mini-app en React plat ; porte de sortie documentée dans le README (~30 lignes de localStorage équivalentes) ; les deux tests d'intégration de la phase 2 comme garde-fous.
- **README de transmission** : architecture en cinq lignes, où vit chaque secret, comment désactiver l'inférence, comment remplacer unreel, comment modifier un champ.
- **Relecture complète avec le 2ᵉ dev en fin de phase 2** — critères : relais PHP lisible en entier en 15 min, mini-app en 30. C'est un critère de conception, pas un vœu.
- **Fallbacks documentés** : formulaires Teable natifs si la phase 0 les ressuscite ; fiches papier sinon — qui, on l'a vu, survivent à tout.

---

*Document vivant — amendé au fil des décisions. Dernière révision : 21/10/2026.*
