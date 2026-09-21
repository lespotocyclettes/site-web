# Fondation CSS de la mini-app

Ce dossier contient :
- les **tokens** de design (couleurs, espacements, typo)
- une **couche de base** qui rend le HTML nu présentable, sans aucune classe
- six composants et trois primitives de mise en page
- un **styleguide** qui montre tout ça

Pas de préprocesseur, pas de Tailwind, pas de CSS-in-JS. Du CSS standard, qui marche sans build.

Une seule chose à savoir pour brancher : le CSS de base ne s'applique qu'à l'intérieur de `.potos-app`, classe à poser sur le `<html>`. C'est ce qui l'empêche de déborder si on charge ce CSS un jour dans une page Paheko ou WordPress.

## Regarder le résultat

Ouvrir `styleguide/index.html` dans un navigateur. Pas de serveur, pas de build.

C'est la doc, et c'est aussi le filet de sécurité : si un composant n'apparaît pas dans le styleguide, considérez qu'il n'existe pas.

## Changer l'apparence

Tout se joue dans `src/styles/semantic.css`. C'est le seul fichier à ouvrir pour rethémer.

Les couleurs viennent du thème du site et sont renommées par leur rôle (`--color-text-body`, pas `--secondary`). Chacune porte sa version claire et sa version sombre sur la même ligne, avec `light-dark()`.

Règle : **aucune couleur en dur ailleurs que dans ce fichier.**

Les polices suivent la même logique : Asap pour le texte, Concert One pour les titres, reprises du thème du site. Les fichiers sont embarqués dans `src/styles/fonts/` et déclarés dans `fonts.css`. Pour en changer, `--font-body` et `--font-heading` suffisent.

## Ajouter un composant

1. créer `src/components/mon-composant/mon-composant.css`
2. l'ajouter au manifeste `src/styles/index.css`
3. l'ajouter au styleguide, avec toutes ses variantes et tous ses états

La convention :
- le composant est une classe en **deux mots** (`.action-button`), ses parties sont des classes en **un mot**, en enfant direct (`> .title`)
- les variantes et les états sont des **data-attributes** (`data-variant="primary"`), jamais des classes
- une variante ne redéfinit que des molettes `--_*`, jamais une règle

`npm run lint:css` refuse ce qui sort de là.

## Vérifier

`npm run verify` enchaîne quatre contrôles :
- la grammaire des classes (Stylelint)
- les types (`tsc`)
- tout `var()` pointe sur un token qui existe
- tout couple texte / fond atteint le contraste WCAG AA

Ce que ça ne vérifie pas : le rendu. Ça reste à faire à l'œil, au clavier, et sur un vrai téléphone.

## Deux pièges

**Les fichiers de `src/styles/vendor/` ne s'éditent pas.** Ils viennent d'[Open Props](https://open-props.style/) et leur en-tête dit d'où. Pour les mettre à jour, re-télécharger la source. `props.shadows.css` est le seul à diverger de l'original, son en-tête explique pourquoi. Même chose pour les `.woff2` de `src/styles/fonts/`, sous licence OFL.

**Le CSS hors couche bat le CSS en couche**, quelle que soit la spécificité. C'est pour ça que chaque fichier de composant déclare son `@layer components` lui-même : un fichier chargé sans sa couche gagnerait sur tout le reste.
