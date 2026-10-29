---
statut: proposée, à co-signer par le second dev
date: 2026-10-27
---

# 0002. Les dépendances de la mini-app

La mini-app de gestion des vélos fait entrer cinq dépendances, en plus de React qui était
déjà là. La règle 1 de [CONCEPTION.md](../../CONCEPTION.md) demande un plan de sortie écrit
avant d'adopter une dépendance, et la règle 4 demande d'être plus exigeant avec ce qui part
dans le produit. Cette fiche fait les deux, dépendance par dépendance.

| Dépendance | À quoi elle sert | Part dans le produit ? |
|---|---|---|
| Vite | Serveur de développement, et assemblage de l'app en fichiers à déposer | Non |
| Vitest | Lancer les tests | Non |
| Testing Library + happy-dom | Tester des composants React sans ouvrir de navigateur | Non |
| TanStack Query | Appeler le relais : cache, annulation, rafraîchissement après un changement | **Oui** |
| unreel | Enchaîner les étapes de l'enregistrement, et les retenir si on recharge la page | **Oui** |

## Pourquoi cette décision est écrite

Une dépendance qui part dans le produit se retrouve appelée depuis beaucoup de fichiers. On
ne la retire pas en un après-midi. Et un relecteur qui découvre la mini-app se demandera
pourquoi elle a besoin de tout ça pour trois écrans.

## Dépendance par dépendance

**Vite.** Il était acté depuis octobre (voir l'amendement du
[plan](../plans/gestion-des-velos.md)). Il ne part pas dans le produit : ce qu'il produit,
ce sont des fichiers HTML, CSS et JavaScript ordinaires. La fondation CSS et son styleguide
n'en dépendent pas et s'ouvrent toujours d'un double-clic.
_Porte de sortie_ : n'importe quel autre assembleur (esbuild par exemple) lit le même code.
Il n'y a qu'un fichier de configuration à réécrire.

**Vitest, Testing Library, happy-dom.** Sans eux, on ne peut pas écrire les deux tests que
le plan déclare non négociables. Aucun ne part dans le produit. Vitest est le lanceur de
tests qui comprend la configuration de Vite. happy-dom imite un navigateur dans le terminal.
Testing Library manipule les composants comme le ferait un bénévole : il clique sur un
bouton par son libellé, pas par son nom de classe.
_Porte de sortie_ : les tests des règles métier sont du TypeScript pur, n'importe quel
lanceur les fait tourner (y compris celui intégré à Node). Testing Library existe aussi pour
d'autres lanceurs.

**TanStack Query.** Il part dans le produit. On l'a retenu parce que le code des écrans est
bien plus digeste avec que sans : chaque écran demande une donnée, et c'est lui qui gère
l'attente, l'erreur, le cache, l'annulation d'une recherche devenue inutile et le
rafraîchissement après un changement de statut. Écrit à la main, tout ça se répète dans
chaque écran, et c'est là que naissent les bugs. C'est une bibliothèque vivante, très
répandue, et sans dépendance à elle seule.
_Porte de sortie_ : les écrans ne voient que les options préparées par `app/src/api/`. Sans
TanStack Query, on réécrit ce dossier avec un petit cache maison (de l'ordre de cent lignes),
puis on remplace chaque `useQuery` par le hook maison. C'est un travail d'une journée, pas un
mur.

**unreel.** Il part dans le produit, et c'est un pari : la bibliothèque est écrite par
Géraud, elle n'est pas encore publiée, et on s'en sert ici pour l'éprouver (le
« dogfooding »). Le plan l'autorise sous conditions, et cette fiche les reprend :

- elle reste confinée à l'enregistrement, le seul parcours fait d'étapes successives ;
- un seul dossier l'importe, `app/src/registration/sequencer/`. Le reste de la mini-app est
  du React ordinaire ;
- tant qu'elle n'est pas publiée, on la branche par un lien vers son dossier sur la machine
  de Géraud. Avant la relecture par le second dev, on passe à une archive copiée dans le dépôt
  (`app/vendor/unreel/`), pour que n'importe qui puisse installer le projet.

_Porte de sortie_ : remplacer le contenu de `sequencer/` par une trentaine de lignes : un
`useReducer` qui retient l'étape courante, et une sauvegarde dans le `localStorage`. Les
étapes elles-mêmes ne changent pas.

## Les options écartées

- **Pas de bibliothèque pour les appels au relais**, juste `fetch` et `useEffect`. Écartée :
  c'est la forme qui fait naître les bugs d'attente, d'annulation et de cache, et elle se
  répète dans chaque écran.
- **oRPC**, dont on reprend pourtant la forme des appels
  (`api.bikes.search.queryOptions({ input })`). oRPC n'impose pas son serveur : il accepte
  un contrat écrit à la main (`createORPCReactQueryUtils` de `@orpc/react-query`), donc il
  marcherait avec notre relais PHP. Écartée pour l'instant : ce serait une dépendance de plus
  dans le produit, pour un motif qui tient en une trentaine de lignes. Comme on garde la même
  forme d'appel, passer à oRPC plus tard ne toucherait pas les écrans.
- **Un routeur** pour passer d'un écran à l'autre. Écarté : le navigateur sait déjà le faire
  avec le `#` de l'adresse, et trois écrans n'en demandent pas plus.

## Ce que ça implique

- La co-signature du second dev reste à obtenir. Tant qu'elle manque, cette fiche est
  « proposée », et rien dans le code ne doit rendre unreel plus difficile à retirer que ce
  qui est écrit ici.
- Chaque nouvelle dépendance ajoute sa ligne à cette fiche, avec sa porte de sortie.

Voir aussi les mots *dépendance*, *dépendance de développement*, *build* et *porte de
sortie* du [glossaire technique](../../GLOSSAIRE-TECHNIQUE.md).
