---
statut: acceptée
date: 2026-10-20
---

# 0001. Structure rscss, variantes en attributs `data-*`

Les classes CSS de la mini-app suivent la convention rscss pour leur structure : un
composant s'appelle en deux mots, ses parties en un seul, et on vise une partie seulement
si elle est fille directe du composant. Les déclinaisons et les états, eux, ne sont jamais
des classes : ce sont des attributs `data-*`. On a choisi ça parce que rscss est la seule
convention qu'un programme sait vérifier tout seul, et parce qu'une déclinaison écrite en
attribut se pilote depuis le code comme une donnée.

```html
<button class="action-button" data-variant="primary">Enregistrer</button>
```

## Pourquoi cette décision est écrite

Changer de convention, c'est renommer toutes les classes de tous les composants en même
temps. On ne peut pas le faire à moitié. Et quelqu'un qui découvre le code se demandera
pourquoi les déclinaisons ne sont pas des classes, comme presque partout ailleurs.

## Les options écartées

- **Garder la convention d'Open Props UI** (`.ui-button.ui-filled.ui-primary`), puisque
  nos composants en sont copiés. Écartée : Open Props UI n'est pas une dépendance qu'on met
  à jour, c'est un catalogue qu'on copie une fois. Sa convention n'est donc pas un contrat
  à respecter, juste un héritage. On la traduit en entrant.
- **rscss jusqu'au bout**, avec les déclinaisons en classes préfixées d'un tiret
  (`.-primary`), comme le prévoit la convention. Écartée : depuis React il faudrait
  assembler des chaînes de classes. En attribut, on écrit `data-variant={variant}` et c'est
  fini. C'est aussi la forme qu'utilisent les bibliothèques de composants récentes
  (`data-state="open"`) : si on en ajoute une un jour, elle parlera la même langue.

Pour être honnête, sur le papier les options se valaient. Ce qui a tranché, c'est la
vérification automatique : avec rscss, c'est Stylelint qui refuse une classe mal formée,
pas un relecteur qui doit penser à la repérer.

## Ce que ça implique

- **Le `>` est fragile.** Une balise glissée entre un composant et sa partie casse le
  style, sans message d'erreur, et Stylelint ne le voit pas : il lit le CSS, pas le HTML.
  C'est arrivé sur la fenêtre modale du styleguide.
- **Le linter ne vérifie que la structure.** Les attributs `data-*` sont libres. Leur
  cohérence repose sur le styleguide, où chaque composant montre toutes ses déclinaisons.
- **Les états natifs restent natifs.** `:disabled`, `:invalid`, `[aria-expanded]` : on
  n'invente un attribut que pour ce que le HTML ne sait pas dire.
- **Sauf pour désactiver un bouton** (précision du 30/10/2026) : `ActionButton` pose
  `aria-disabled`, pas `disabled`. Un bouton `disabled` sort de l'ordre de tabulation :
  au clavier ou au lecteur d'écran on ne tombe plus dessus, et il perd le focus quand son
  action démarre. Avec
  `aria-disabled`, c'est le composant qui bloque le clic. Le CSS habille les deux formes.
- **Les briques de mise en page s'appellent `layout-stack`, `layout-grid`.** Deux mots,
  donc conformes, plutôt qu'une liste d'exceptions dans la configuration du linter.

Voir aussi la règle 6 de [CONCEPTION.md](../../CONCEPTION.md), et les mots *rscss*,
*variante* et *combinateur enfant* du [glossaire technique](../../GLOSSAIRE-TECHNIQUE.md).
