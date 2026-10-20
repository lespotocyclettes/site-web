# Site des Poto'Cyclettes

Le dépôt du site de l'association et de ses outils numériques.

## Ce qu'il y a dedans

- [wp-plugin](./wp-plugin/) : le plugin WordPress maison. Des blocs Gutenberg sur mesure,
  les styles globaux du thème, et la double authentification.
- [app](./app/) : la mini-app de gestion des vélos. Pour l'instant elle contient sa
  fondation CSS et son styleguide, pas encore de métier.
- [docs/plans](./docs/plans/) : les plans de projet. Pour l'instant celui de la mini-app
  vélos, amendé au fil des décisions.
- [docs/adr](./docs/adr/) : les fiches de décision. Une par choix difficile à défaire, avec
  les options écartées et la raison du choix.

## À lire avant de coder

Trois documents, dans cet ordre.

1. [CONCEPTION.md](./CONCEPTION.md) : comment on tranche, et pourquoi. Neuf règles et une
   checklist d'ouverture de projet.
2. [GLOSSAIRE-METIER.md](./GLOSSAIRE-METIER.md) : le vocabulaire des vélos et de l'asso. Un
   mot par concept, et les synonymes à ne pas employer. C'est aussi ce que lisent les
   assistants IA.
3. [GLOSSAIRE-TECHNIQUE.md](./GLOSSAIRE-TECHNIQUE.md) : le vocabulaire informatique,
   expliqué pour quelqu'un qui débute. Si un mot du code vous bloque, il est là.

Chaque dossier a ensuite son propre README, avec les étapes pour installer et développer.

## Et les assistants IA ?

Le fichier [AGENTS.md](./AGENTS.md) est écrit pour eux, pas pour vous. La plupart des
assistants de code le lisent automatiquement en arrivant dans le dépôt, comme vous lisez ce
README. Il leur dit quoi consulter avant de travailler : le guide, les glossaires, les
fiches de décision.

Vous n'avez pas besoin de le lire. Si vous déplacez ou renommez un de ces documents,
pensez juste à mettre à jour ses liens.
