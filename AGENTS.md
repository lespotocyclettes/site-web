# Consignes pour les assistants IA

Tout s'écrit en français : documentation, commentaires, messages de commit, descriptions de
changement.

Le relecteur n'est pas développeur professionnel. Chaque mot technique s'explique à sa
première apparition.

## Avant de...

- **travailler sur la mini-app vélos** : lis [son plan](./docs/plans/gestion-des-velos.md).
  Les amendements en tête priment sur le reste du document.
- **nommer quoi que ce soit** (variable, champ, libellé, test, fichier) : lis
  [GLOSSAIRE-METIER.md](./GLOSSAIRE-METIER.md). Il donne le mot retenu pour chaque concept,
  et ceux à éviter.
- **écrire de la prose** (doc, commentaire, commit) : lis la règle 9 de
  [CONCEPTION.md](./CONCEPTION.md). Un terme technique absent de
  [GLOSSAIRE-TECHNIQUE.md](./GLOSSAIRE-TECHNIQUE.md) s'y ajoute dans le même changement.
- **ajouter une dépendance, un outil de développement ou une étape de build** : lis la règle 4 de
  [CONCEPTION.md](./CONCEPTION.md). Ces choix se co-signent : propose, l'humain tranche.
- **changer une convention qui te paraît étrange** : lis [docs/adr/](./docs/adr/). Elle est
  sans doute voulue, et la fiche dit pourquoi.
- **prendre une décision difficile à défaire** : propose une fiche dans
  [docs/adr/](./docs/adr/). Courte : la décision, les options écartées, la raison.

## Avant de rendre la main

- Si tu as touché au CSS ou au styleguide : `npm run verify` passe au vert dans `app/`, et
  chaque composant modifié figure au styleguide avec toutes ses variantes.
- Ce que la vérification ne couvre pas (le rendu, la tenue sur un vrai téléphone) est
  annoncé comme non vérifié.
