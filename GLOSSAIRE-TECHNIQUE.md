# Glossaire technique

Le vocabulaire informatique du projet, expliqué pour quelqu'un qui débute.

Si vous tombez sur un mot bizarre en lisant le code, il devrait être ici. Si ce n'est pas
le cas, c'est un trou dans ce fichier : dites-le, ou ajoutez-le.

Les termes CSS ci-dessous ont tous leur page sur developer.mozilla.org, en français.
Cherchez le nom exact, c'est le bon réflexe à prendre.

Pour le vocabulaire des vélos et de l'association, voir
[GLOSSAIRE-METIER.md](./GLOSSAIRE-METIER.md).

## Les bases

Si vous débutez vraiment, commencez par là.

**Dépôt** :
Le dossier du projet, suivi par git, avec tout son historique. Celui-ci s'appelle
`site-web`. En anglais on dit *repository*, souvent raccourci en *repo*.

**Dépendance** :
Du code écrit par quelqu'un d'autre, qu'on fait entrer dans le projet pour ne pas le
réécrire. Chaque dépendance est un engagement : il faudra la suivre, ou s'en séparer un
jour.

**API** :
La liste des demandes qu'un service accepte, et de ce qu'il répond. Teable a une API : on
lui envoie « crée cet enregistrement », il répond « c'est fait, voici son identifiant ».

**JSON** :
Un format de texte pour échanger des données entre programmes. C'est ce qui circule entre
la mini-app et le serveur.

## Le vocabulaire maison

Ces mots-là, on les a choisis. Vous ne les trouverez pas sur Internet avec ce sens.

**Fondation** :
L'ensemble du CSS de base de la mini-app : les tokens, le reset, la couche de base et les
composants. Elle vit dans `app/src/styles/` et `app/src/components/`.

**Token** :
Une valeur de design nommée, par exemple une couleur ou un espacement. En CSS c'est une
variable, écrite `--color-text-body`. On ne met jamais une couleur en dur dans le code :
on nomme un token, et on change sa valeur à un seul endroit.

**Molette** :
Une propriété personnalisée qu'une règle CSS lit, et qu'on tourne pour changer le rendu
sans toucher à la règle. Il y en a deux sortes.
- **Privée**, préfixée `--_`, par exemple `--_bg`. Le composant écrit sa règle une fois en
  lisant ses molettes, et chaque variante ne fait que les tourner. Le `_` dit « ne touchez
  pas à ça depuis l'extérieur ».
- **Publique**, sans `_`, par exemple `--gap` sur une brique de mise en page, ou
  `--color-field-border`. Elle est faite pour être réglée de l'extérieur.

**Brique de mise en page** :
Une des trois classes `layout-stack` (empiler), `layout-cluster` (aligner en ligne, avec
retour à la ligne) et `layout-grid` (grille). Elles rangent des éléments les uns par
rapport aux autres, sans rien dessiner.
_Éviter_ : « primitive », « outil de mise en page ».

**Manifeste** :
Le fichier `app/src/styles/index.css`, qui déclare l'ordre des couches et importe tout le
reste. Un seul fichier charge la fondation. Si vous ajoutez un composant, c'est là qu'il
s'inscrit.

**Vendorer** :
Copier le code d'une bibliothèque dans notre dépôt au lieu de l'installer comme
dépendance. Les fichiers vendorés vivent dans `app/src/styles/vendor/`, ils portent leur
version et leur licence en en-tête, et **on ne les édite pas**.

**Open Props** :
La bibliothèque de tokens qu'on a vendorée : des échelles toutes faites d'espacements, de
tailles de texte, d'épaisseurs de bordure (`--size-3`, `--border-size-1`). Nos tokens à
nous sont construits par-dessus.

**Styleguide** :
La page `app/styleguide/index.html`, qui montre tous les composants avec toutes leurs
variantes. On l'ouvre d'un double-clic, sans rien installer. Un composant qui n'y est pas
n'existe pas.

## Le CSS qu'on utilise

**Sélecteur** :
La partie d'une règle CSS qui désigne *quoi* styler, avant les accolades. Dans
`.action-button { ... }`, le sélecteur c'est `.action-button`.

**Classe** :
L'étiquette qu'on colle sur une balise HTML pour pouvoir la viser en CSS. On l'écrit
`class="content-card"` dans le HTML, et `.content-card` dans le CSS.

**Attribut** :
Une information posée sur une balise HTML, sous la forme `nom="valeur"`. Nos déclinaisons
de composants en sont : `data-variant="primary"`. Tout attribut commençant par `data-` est
libre, le navigateur nous laisse y mettre ce qu'on veut.

**Cascade** :
La façon dont le navigateur départage deux règles CSS qui se contredisent sur le même
élément. C'est le mécanisme central du CSS, et c'est de là que vient le C de CSS.

**Héritage** :
Certaines propriétés passent automatiquement d'un élément à ses enfants, comme la couleur
du texte ou la police. D'autres non, comme les bordures. Les propriétés personnalisées
s'héritent, et c'est ce qui rend les molettes possibles.

**Propriété personnalisée** :
Le vrai nom des variables CSS, celles qui commencent par `--`. Elles s'héritent, comme la
couleur du texte : une valeur posée sur un parent descend sur ses enfants. C'est ce qui
rend les molettes possibles.
_Éviter_ : « variable Sass », qui est autre chose et n'existe pas ici.

**`@layer`** :
Une couche de cascade. Elle sert à dire qui gagne quand deux règles se contredisent, sans
jouer à la surenchère de sélecteurs. Nos couches, dans l'ordre : `reset`, `base`, `layout`,
`components`, `utilities`.

Le piège à connaître : **le CSS hors couche bat le CSS en couche**, quelle que soit la
spécificité. C'est pour ça que chaque fichier déclare lui-même sa couche.

**`@scope`** :
Une portée. Elle limite où des règles s'appliquent, ici à l'intérieur de l'élément qui
porte la classe `.potos-app`. C'est ce qui empêche notre CSS de déborder si on le charge un
jour dans une page WordPress ou Paheko.

`@layer` ordonne, `@scope` isole. Les deux ne font pas le même travail.

**`light-dark()`** :
Une fonction qui prend deux valeurs, celle du thème clair et celle du thème sombre, et
choisit la bonne. Elle évite d'écrire deux fois toute la palette.

**`color-mix()`** :
Mélanger deux couleurs en CSS. On s'en sert pour dériver un survol ou un fond pâle depuis
une couleur existante, plutôt que de maintenir une couleur de plus.

**`:has()`** :
Un sélecteur qui vise un élément d'après ce qu'il contient. Par exemple « le champ qui
contient une saisie invalide ». Il évite de synchroniser des classes depuis JavaScript.

**`:user-invalid`** :
L'état d'un champ mal rempli, mais seulement une fois que la personne y a touché. Un champ
obligatoire encore vide n'est donc pas rouge dès l'ouverture de la page.

**`!important`** :
Un mot posé à la fin d'une déclaration CSS pour la faire passer devant toutes les autres.
Avec les couches, son effet s'inverse : c'est la couche la plus basse qui gagne. On en a
un seul, dans le reset.

**Spécificité** :
Le score qui départage deux règles CSS visant le même élément. Plus un sélecteur est
précis, plus il pèse. On essaie de ne pas jouer à ce jeu, justement grâce aux couches.

**Reset** :
Les quelques règles qui neutralisent les décisions arbitraires du navigateur (les marges
par défaut, par exemple) avant qu'on pose les nôtres.

## La grammaire des classes

**rscss** :
La convention de nommage qu'on suit. Un composant porte deux mots (`action-button`), ses
parties un seul (`title`), et on les vise en enfant direct (`> .title`). C'est une
convention, pas une bibliothèque : personne ne l'implémente, on la fait respecter par un
linter.

**Composant** :
Un bloc réutilisable, avec son dossier, son CSS et son entrée au styleguide. Exemples :
`action-button`, `content-card`.

**Élément** :
Une partie d'un composant, nommée d'un seul mot : `title`, `footer`, `actions`.
Attention : un wrapper intercalé casse le `>` et la règle ne s'applique plus, en silence.

**Variante** :
Une déclinaison d'un composant, écrite en attribut : `data-variant="primary"`. Jamais en
classe. Une variante est une donnée, on la pilote depuis le code sans assembler des
chaînes de caractères.

**Combinateur enfant** :
Le `>` dans `.content-card > .title`. Il ne vise que les enfants directs, pas les
descendants plus profonds. On l'impose pour que la portée d'une règle soit lisible d'un
coup d'œil.

## Le terrain et l'accessibilité

**Mobile-first** :
Écrire d'abord pour le petit écran, puis élargir. Jamais l'inverse.

**Cible tactile** :
La surface tapable d'un bouton. Minimum 48 px de haut chez nous. C'est un plancher.

**WCAG** :
Le référentiel d'accessibilité du web. On vise le niveau AA, et un script le mesure.

**Contraste** :
Le rapport de luminosité entre un texte et son fond, écrit par exemple `4,5:1`. En dessous
du seuil, le texte devient illisible pour une partie des gens, et pour tout le monde en
plein soleil.

**`:focus-visible`** :
L'état d'un élément sélectionné au clavier. Il doit toujours se voir, sinon on ne peut plus
naviguer sans souris.

**`prefers-reduced-motion`** :
Un réglage système qui dit « j'ai besoin de moins d'animation ». On le respecte.

**Police variable** :
Un seul fichier de police qui couvre toutes les graisses, du maigre au gras, au lieu d'un
fichier par graisse. Asap, notre police de texte, en est une.

**woff2** :
Le format de police du web. Nos fichiers sont dans `app/src/styles/fonts/` et sont servis
par nous, pas par Google.

**`unicode-range`** :
La liste des caractères que couvre un fichier de police. On n'embarque que le latin, qui
suffit au français. Le reste retombe sur la police du système.

## Les logiciels de développement

**AGENTS.md** :
Un fichier à la racine du dépôt, écrit pour les assistants IA de code. Ils le lisent
automatiquement en arrivant, comme un nouveau bénévole lirait le README. Le nôtre les
renvoie vers le guide, les glossaires et les fiches de décision.

**Linter** :
Un programme qui relit le code et refuse ce qui sort des conventions. Chez nous
**Stylelint** tient la grammaire des classes.

**Formateur** :
Un programme qui réécrit la mise en forme du code, indentation comprise, pour que tout le
monde rende le même texte. Chez nous c'est **Biome**, et lui seul.

**Script npm** :
Une commande raccourcie, déclarée dans `package.json`. `npm run verify` enchaîne nos
quatre vérifications.

**Workspace** :
Un sous-projet dans un dépôt qui en contient plusieurs. Ici `app` en est un.

**JSX** :
Du HTML écrit au milieu du code React, par exemple `<div className="layout-stack">`.
Un outil le traduit en JavaScript avant que le navigateur le lise.

**Fichier de déclaration** :
Un fichier `.d.ts`. Il ne contient que des types TypeScript, aucun code exécuté. Il sert à
décrire au vérificateur de types quelque chose qu'il ne sait pas deviner seul.

**Build** :
L'étape qui transforme le code source en fichiers servis au navigateur. La fondation CSS
n'en a pas besoin : elle marche telle quelle, et c'est voulu.

**Dépendance de développement** :
Une bibliothèque utile pour travailler, mais absente du produit livré. Si elle meurt,
le produit tourne encore. Une dépendance d'exécution, elle, part avec le produit.

**Vite** :
L'outil de build de la mini-app. `npm run dev` lance un serveur local qui recharge la page à
chaque modification, `npm run build` produit les fichiers à déposer sur le serveur. Il ne
part pas dans le produit.

**Vitest** :
Le lanceur de tests de la mini-app : `npm test` exécute tous les fichiers `*.test.ts`. Il lit
la même configuration que Vite.

**happy-dom** :
Une imitation de navigateur qui tourne dans le terminal. Elle permet de tester un composant
React sans ouvrir de vraie page.

**Testing Library** :
Une bibliothèque de test qui manipule les composants comme le ferait un bénévole : elle
trouve un bouton par son libellé, pas par sa classe CSS. Un test écrit comme ça casse quand
l'usage change, pas quand on renomme une classe.

**TanStack Query** :
La bibliothèque qui gère les appels au relais depuis les écrans : l'attente, l'erreur, la
mémoire des réponses déjà reçues, et leur rafraîchissement quand une donnée change. Elle
part dans le produit ; sa porte de sortie est dans la fiche
[0002](./docs/adr/0002-dependances-mini-app.md).

**Clé de requête** :
L'étiquette sous laquelle TanStack Query range une réponse, par exemple
`["bikes", "search", { text: "peugeot" }]`. Deux écrans qui demandent la même clé
partagent la même réponse.

**Invalider** :
Dire à TanStack Query qu'une réponse rangée n'est plus à jour, pour qu'il la redemande.
Après un changement de statut, on invalide tout ce qui commence par `["bikes"]` : la
recherche comme la fiche se rafraîchissent.

**Hook** :
Une fonction React dont le nom commence par `use` (`useQuery`, `useApi`). Elle ne
s'appelle que dans un composant, et le composant se redessine quand ce qu'elle renvoie
change.

**Contexte (React)** :
Une valeur posée une fois en haut de l'application, que n'importe quel composant en
dessous peut lire sans qu'on la lui passe à la main. L'api de la mini-app y vit : `main.tsx`
y branche le faux relais ou le vrai, et chaque test y branche le sien.

**Suspense** :
Un composant React qui affiche un remplaçant (chez nous, un skeleton) tant que ce qu'il
contient attend ses données. Avec `useSuspenseQuery`, un composant ne s'affiche qu'une fois
ses données arrivées : il n'a pas d'état « en chargement » à gérer.

**Error boundary** :
Un composant React qui attrape les erreurs des composants qu'il contient et affiche un
message à leur place, au lieu d'une page blanche. Chez nous, il propose « Réessayer ». La
mini-app en a un seul, écrit à la main (`app/src/screen/error-boundary.tsx`).

**Skeleton** :
Des formes grises qui tiennent la place du contenu pendant son chargement : la page ne
saute pas quand il arrive. Le composant s'appelle `.loading-skeleton`.

**Override (npm)** :
Une ligne du `package.json` racine qui force npm à prendre une version précise d'un paquet,
même quand un autre paquet en demande une différente. On s'en sert pour unreel, qui n'est
pas encore publié : son paquet React réclame son paquet de base sous une forme que seul son
propre dépôt comprend, l'override dit à npm où le trouver.

**Shell** :
Le programme qui lit les commandes tapées dans un terminal (bash, zsh…). Il coupe une
commande à chaque espace : un chemin qui contient une espace doit être entouré de
guillemets, sinon il devient deux morceaux.

**rsync** :
Un programme qui copie un dossier vers un autre en ne recopiant que ce qui a changé.
`npm run dev` s'en sert pour copier le plugin dans le WordPress local.

**WSL** :
Pour *Windows Subsystem for Linux*, un Linux qui tourne à l'intérieur de Windows. Les
outils du plugin, rsync compris, s'y lancent.

## Côté serveur

**mu-plugin** :
Un plugin WordPress « must-use », déposé dans un dossier spécial et toujours actif, qu'on
ne peut pas désactiver par erreur depuis l'administration.

**Relais** :
Notre code PHP qui se place entre la mini-app et Teable. Il garde les secrets côté serveur,
génère les références et valide les transitions de statut. L'app ne parle jamais
directement à Teable.
_Éviter_ : « proxy » seul, qui laisse croire qu'il ne fait que transmettre.

**Port** :
Le contrat que la mini-app attend d'un service extérieur, écrit en TypeScript sans dire
comment il est rempli. Celui du relais s'appelle `BikeStore` (`app/src/bike-store/`). Les
écrans dépendent du port, jamais d'un adaptateur précis : c'est ce qui permet d'en changer.

**Adaptateur** :
Un code qui remplit un port. Pour `BikeStore`, il y en a un vrai (qui appellera le relais)
et un faux.

**Faux relais** :
L'adaptateur de `BikeStore` qui garde les vélos en mémoire, le temps d'une page ouverte. Il
imite les règles du vrai relais. Il sert à construire les écrans avant que le relais
existe, et aux tests.

**Route** :
Une adresse que le serveur sait traiter, par exemple `POST /velo`. Le verbe (`GET`, `POST`,
`PATCH`) dit ce qu'on veut en faire.

**Machine à états** :
Une façon de décrire un parcours où seules certaines transitions sont permises. Le statut
d'un vélo en est une, et c'est le serveur qui la fait respecter.

**Inférence** :
Faire deviner des champs par un modèle d'IA à partir d'une photo. Toujours optionnelle :
si elle échoue, on saisit à la main et personne ne s'en aperçoit.

**Kill switch** :
Un interrupteur qui coupe une fonctionnalité sans toucher au code. Celui de l'inférence est
dans `wp-config.php`.

## Les mots de la méthode

Ceux-là viennent de [CONCEPTION.md](./CONCEPTION.md), où ils sont expliqués en long.

**ADR** :
Pour *Architecture Decision Record*, une fiche de décision. Un court fichier qui note une
décision difficile à défaire, les options écartées et la raison du choix. On en écrit une
quand trois conditions sont réunies : la décision coûte cher à changer, elle surprendrait
quelqu'un qui découvre le code, et il y avait de vraies alternatives. Les fiches vivent
dans `docs/adr/`, numérotées dans l'ordre.

**Bus factor** :
Le nombre de personnes qui peuvent disparaître avant que le projet soit bloqué. On veut au
moins 2.

**Dégradation gracieuse** :
Quand une partie tombe, le reste continue de servir. Le papier est notre dernier étage de
dégradation.

**Porte de sortie** :
Le plan écrit d'avance pour se débarrasser d'une dépendance. Si elle ne tient pas en
quelques dizaines de lignes, ce n'est pas une porte de sortie.

**Timebox** :
Une date fixée à l'avance et tenue, quel que soit l'état du logiciel.
