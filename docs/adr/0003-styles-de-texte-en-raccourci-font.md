---
statut: acceptée
date: 2026-11-10
---

# 0003. Les styles de texte : un token par rôle, pour le raccourci `font`

Chaque rôle de texte (libellé, légende, titre, référence…) a son token `--text-*`, déclaré
dans `app/src/styles/semantic.css`. Le token réunit la graisse, la taille, l'interligne et
la police, et s'emploie avec le raccourci `font`. Ses valeurs s'écrivent en dur, en rem,
sans renvoyer aux échelles d'Open Props. La couleur reste à part.

```css
--text-label: 600 1rem / 1.5rem var(--font-body);

.label {
	font: var(--text-label);
	color: var(--color-text-heading);
}
```

## Pourquoi cette décision est écrite

La convention surprend sur trois points. Les tailles ne passent pas par les tokens
d'Open Props, alors que tout le reste le fait. Une retouche s'écrit *après* le raccourci,
jamais avant. Et les familles de police (`--font-body`) et les styles (`--text-label`)
portent deux préfixes différents.

## Les options écartées

- **Nommer les styles `--font-label`**, comme le prévoyait la feuille de route. Écartée :
  `--font-heading` désigne déjà une famille. `var(--font-heading)` et `var(--font-label)`
  se seraient côtoyés sans rien dire de leur différence.
- **Composer les styles à partir des tokens d'Open Props**
  (`var(--font-size-1) / var(--font-lineheight-3)`). Écartée : le `--text-*` est déjà la
  seule référence, définie en un seul endroit. Une indirection de plus oblige à ouvrir
  deux fichiers pour connaître une taille, sans rien rendre plus facile à changer.
- **Laisser l'interligne hors du token**, et écrire `line-height: inherit` après le
  raccourci. Écartée : deux lignes par emploi. Un oubli redonne l'interligne « normal »,
  sans alerte. Et dans WordPress, le parent de l'app est le thème du site.
- **Des titres fluides**, qui grandissent en continu avec la fenêtre (`clamp()`).
  Écartée : un interligne en valeur absolue ne peut pas suivre une taille qui varie.
  Les titres ont deux paliers, le grand redéfini dans une media query.

## Ce que ça implique

- **Chaque token porte son interligne.** Le raccourci remet à leur valeur par défaut les
  réglages qu'il ne précise pas, interligne compris.
- **Une retouche s'écrit après le raccourci.** Le bouton `small` garde sa molette de taille
  (`font-size: var(--_font-size)`), écrite sous `font: var(--text-label)`.
- **Les interlignes tombent sur une grille de 0,25rem** (4 px), celle de l'échelle
  d'espacement.
- **Le seuil des titres est écrit en dur** (`40rem`) : `var()` n'est pas permis dans la
  condition d'une media query. Il se mesure sur la fenêtre, pas sur la colonne où vit
  l'app. On ajustera à l'usage.
- **Le styleguide montre chaque style**, et `scripts/check-tokens.mjs` refuse un
  `--text-*` absent de sa liste `TEXT_TOKENS`.

Voir aussi les mots *raccourci `font`*, *rem*, *chasse fixe* et *media query* du
[glossaire technique](../../GLOSSAIRE-TECHNIQUE.md).
