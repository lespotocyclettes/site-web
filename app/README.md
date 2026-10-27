# Mini-app vélos

La mini-app de gestion des vélos : chercher un vélo, voir sa fiche, changer son statut,
enregistrer un nouveau vélo. Pour l'instant c'est un squelette : les trois écrans existent,
mais ils sont presque vides. Ce qui reste à faire est dans la
[feuille de route](../docs/plans/mini-app-velos-feuille-de-route.md), le pourquoi dans le
[plan](../docs/plans/gestion-des-velos.md).

Si un mot vous arrête, il est expliqué dans le [glossaire technique](../GLOSSAIRE-TECHNIQUE.md)
ou le [glossaire métier](../GLOSSAIRE-METIER.md).

## Lancer

```sh
npm install        # à la racine du dépôt, une fois
cd app
npm run dev        # ouvre l'app sur un serveur local, qui se recharge à chaque modification
npm test           # lance les tests
npm run verify     # tous les contrôles, à lancer avant de rendre son travail
```

**Tant qu'unreel n'est pas publié**, l'installation suppose son dépôt cloné dans
`~/workspace/unreel/unreel` et compilé (`pnpm build:all` dans ce dossier). Sinon,
`npm install` échoue. Avant la relecture par le second dev, on passera à une archive copiée
dans `app/vendor/unreel/` (voir la [fiche 0002](../docs/adr/0002-dependances-mini-app.md)).

L'app tourne contre un **faux relais** qui garde trois vélos d'exemple en mémoire : tout ce
qu'on y fait disparaît au rechargement de la page.

## Architecture

```
 écran ── useQuery(api.bikes.search.queryOptions({ input }))
            ▼
 src/api/          les requêtes : ce qu'on demande, et ce qu'on rafraîchit après une action
            ▼
 src/bike-store/   le contrat du relais (BikeStore), et ses adaptateurs :
                   le faux relais en mémoire aujourd'hui, le vrai relais PHP demain
 src/bike/         les règles métier pures : référence, statut, description d'un vélo
```

Un dossier par écran : `src/search/`, `src/bike-sheet/`, `src/registration/`. La navigation
passe par le `#` de l'adresse (`src/navigation/`). `src/main.tsx` choisit le relais.

## Remplacer unreel

unreel enchaîne les étapes de l'enregistrement. Un seul fichier l'importe :
`src/registration/sequencer/registration-sequencer.tsx`. Les étapes, dans
`src/registration/steps/`, sont des composants ordinaires qui ne le connaissent pas. Pour
s'en passer, on réécrit ce seul fichier avec un `useReducer` qui retient l'étape courante et
une sauvegarde dans le `localStorage` : une trentaine de lignes.

## Modifier un champ

_À écrire avec l'incrément « fiche + actions »._ Le point de départ sera
`src/bike/bike.ts` et le glossaire métier.

## Où vit chaque secret

_À écrire avec l'incrément « adaptateur relais »._ Aujourd'hui, aucun : le faux relais n'en
a pas besoin.

## Couper l'inférence

_À écrire avec l'incrément « adaptateur relais »._ Le faux relais l'a déjà coupée.

# La fondation CSS

Ici vit tout ce qui donne son apparence à la mini-app.

Ce dossier contient :
- les **tokens** : les couleurs, les espacements et les tailles de texte, chacun rangé sous
  un nom (`--color-text-body`). On n'écrit jamais une couleur directement dans le code, on
  passe par son nom.
- une **couche de base**, qui rend une page HTML présentable même sans aucune classe
- six composants (bouton, champ de formulaire, carte, tableau, encadré d'information,
  fenêtre modale) et trois briques de mise en page
- un **styleguide** : une page qui montre tout ça

C'est du CSS standard, que le navigateur lit tel quel. Pas d'étape de build, rien à
installer pour voir le résultat.

Une seule chose à savoir pour brancher : la couche de base ne s'applique qu'à l'intérieur
de l'élément qui porte la classe `.potos-app`, à poser sur la balise `<html>`. Comme ça, si
on charge un jour ce CSS dans une page Paheko ou WordPress, il ne touche pas au reste de la
page.

## Regarder le résultat

Double-cliquer sur `styleguide/index.html` : la page s'ouvre dans le navigateur. Pas de
serveur, pas d'installation.

C'est la doc, et c'est aussi le filet de sécurité : si un composant n'apparaît pas dans le
styleguide, considérez qu'il n'existe pas.

## Changer l'apparence

Tout se joue dans `src/styles/semantic.css`. C'est le seul fichier à ouvrir.

Les couleurs viennent du thème du site, mais elles sont renommées selon leur rôle :
`--color-text-body` (le texte courant) plutôt que `--secondary` (la deuxième couleur de la
liste). Chaque couleur porte sa version claire et sa version sombre sur la même ligne,
grâce à la fonction `light-dark()`.

Règle : **aucune couleur écrite directement ailleurs que dans ce fichier.**

Les polices suivent la même logique : Asap pour le texte, Concert One pour les titres,
comme sur le site. Les fichiers de police sont rangés dans `src/styles/fonts/` et déclarés
dans `fonts.css`. Pour en changer, il suffit de modifier `--font-body` et `--font-heading`.

## Ajouter un composant

1. créer `src/components/mon-composant/mon-composant.css`
2. l'ajouter à la liste de `src/styles/index.css`, le fichier qui charge tous les autres
3. l'ajouter au styleguide, avec toutes ses variantes et tous ses états

La convention de nommage :
- le composant porte un nom en **deux mots** (`.action-button`), ses parties un nom en
  **un mot** (`.title`)
- une partie se vise avec `>`, qui veut dire « enfant direct » : `.content-card > .title`.
  Si vous glissez une balise entre les deux, le style ne s'applique plus, et rien ne vous
  prévient.
- les variantes (principal, secondaire, danger) et les états sont des **attributs**, par
  exemple `data-variant="primary"`, jamais des classes
- une variante ne change que des **molettes** : les variables internes du composant, qui
  commencent par `--_`. La règle qui dessine le composant, elle, est écrite une seule fois.

`npm run lint:css` refuse ce qui sort de là. Pourquoi cette convention : voir la
[fiche de décision](../docs/adr/0001-structure-rscss-variantes-en-data-attributes.md).

## Vérifier

`npm run verify` enchaîne cinq contrôles :
- les noms de classes respectent la convention (c'est Stylelint qui vérifie)
- le code React est cohérent dans ses types (c'est `tsc`, le vérificateur de TypeScript)
- chaque token utilisé existe bien quelque part
- chaque couple texte et fond est assez contrasté pour être lu (le seuil AA du référentiel
  d'accessibilité WCAG)
- les règles métier tiennent (c'est Vitest) : format de la référence, statut sans retour en
  arrière, génération des références par le faux relais, saisie par-dessus l'inférence

Les tests ne couvrent pas les écrans eux-mêmes, ni le branchement d'unreel : ça se vérifie
en ouvrant l'app.

Ce que ça ne vérifie pas : le rendu. Ça reste à faire à l'œil, au clavier, et sur un vrai
téléphone.

## Deux pièges

**Les fichiers de `src/styles/vendor/` ne s'éditent pas.** Ils sont copiés depuis
[Open Props](https://open-props.style/), et leur en-tête dit d'où. Pour les mettre à jour,
on retélécharge la source. `props.shadows.css` est le seul à s'écarter de l'original, son
en-tête explique pourquoi. Même chose pour les polices de `src/styles/fonts/`, sous licence
libre OFL.

**Une règle rangée dans aucune couche bat une règle rangée dans une couche**, même si elle
est moins précise. Les couches (`@layer`) servent à dire quelle règle gagne quand deux
règles se contredisent. C'est pour ça que chaque fichier de composant déclare lui-même sa
couche : chargé sans elle, il gagnerait sur tout le reste.
