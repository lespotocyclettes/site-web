# Mini-app vélos — feuille de route

*Ouverte le 27/10/2026, avec le squelette. Le pourquoi est dans le
[plan](./gestion-des-velos.md) ; ce document dit dans quel ordre on construit.*

Chaque incrément livre quelque chose d'utilisable seul (règle 2 de
[CONCEPTION.md](../../CONCEPTION.md)). Les incréments 1 à 3 se construisent contre le faux
relais : ils n'attendent pas le PHP.

```
 0. Migration du schéma Teable ──────────────────────────────┐
                                                             ▼
 1. Recherche ─┐                                    4. Adaptateur relais
 2. Fiche ─────┼── contre le faux relais ──────────►   (+ relais PHP, déploiement)
 3. Enregistrement ┘  ⚠ attend unreel                        │
                                                             ▼
                                                    5. Confort · 6. Sous le coude
```

## Fait : le squelette

Vite et les tests, le domaine (`src/bike/`), le contrat du relais et le faux relais
(`src/bike-store/`), la couche de requêtes (`src/api/`), trois écrans presque vides, unreel
branché par une étape factice. Voir le [README de l'app](../../app/README.md).

## 0. Migration du schéma Teable

La base actuelle ne correspond pas au modèle du glossaire. Il faut l'adapter :

- « Type de vélo » mêle trois facettes : le séparer en type, public et forme du cadre. « Électrique »
  devient une caractéristique ; « home trainer » et « mini » sont à trancher.
- Le statut n'est pas un champ : il se déduit de cases à cocher (« En stock », « Prêt à la
  vente ») et de liens vers d'autres tables (« Sorties », « Démontages », « Mise en vente »).
  En faire un vrai champ à quatre valeurs, et ramener la sortie sur la ligne du vélo.
- « etat » ressemble au triage. La valeur « garder » disparaît. Reste à vérifier que
  « prêt à rouler » correspond bien à « à vendre ».
- « Type de transmission / caractère » mêle le changement de vitesses (facette) et des
  caractéristiques (« vintage », « réservé »).
- Les deux lignes de test (« Test », « TEST-20260713 ») disparaissent.

## 1. Recherche

Le champ texte (référence, marque, modèle), les chips de statut sous forme de toggle-group,
dont une « en stock », et la grille de vignettes photo.

## 2. Fiche + actions

Le recto à l'écran : photo et champs. Les actions selon `getNextStatuses` : « prêt à la
vente » et « démonté » en un tap plus une confirmation ; « sortie de stock » ouvre le
mini-formulaire (acheteur, prix, vente ou don).

## 3. Enregistrement — ⚠ attend unreel

**Bloqué par** la clé de persistance libre d'unreel (`step.run(params, { persistenceKey })`).
Sans elle, reprendre la photo relance l'inférence et efface la saisie du formulaire.

- Le **marquage** d'abord : une question obligatoire, sans réponse par défaut. Un vélo marqué
  dont la propriété n'est pas transférée arrête l'enregistrement.
- Photo (bypassable), inférence, formulaire, envoi, confirmation avec la référence à recopier.
- Ajouter à `src/api/` les suggestions, l'inférence (une mutation : une photo ne peut pas
  servir de clé de requête) et l'envoi de photo.
- Les deux tests non négociables du plan : *reprendre la photo ne perd jamais « peugeot »* ;
  *un submit réussi ne laisse jamais un brouillon fantôme*.

**Limite connue** : tant qu'unreel ne persiste pas l'état d'une étape en cours, une saisie
pas encore validée se perd si le navigateur ferme l'onglet. La persistance par étape est
prévue dans unreel.

## 4. Adaptateur relais

Le relais PHP (phase 1 du plan), puis `src/bike-store/relay-bike-store.ts`, qui le remplit et
remplace le faux relais dans `src/main.tsx`. Viennent avec : le déploiement de l'app compilée,
sa place dans WordPress, le Basic Auth et le secret en en-tête, la vérification automatique
sur GitHub. Le README gagne ses sections « secrets » et « couper l'inférence ».

## 5. Confort

Photo par l'appareil et redimensionnement, listes de suggestions (datalists), chips de
saisie, saisie à rebours derrière un interrupteur.

## 6. Sous le coude

Des champs volontairement laissés de côté, à reprendre vite :

- le **lieu de stockage** (« Rue du Ballon / Box6/A ») ;
- les **pneus** (diamètre et largeur), plus lourds à saisir.

Chacun entrera au glossaire métier avec le code qui l'utilise.

## Avant la relecture par le second dev

- Co-signer la [fiche 0002](../adr/0002-dependances-mini-app.md) (les dépendances).
- Passer unreel du lien vers son dossier à une archive copiée dans `app/vendor/unreel/`.
- Le styleguide montre encore « En stock » comme statut d'exemple : le remplacer par « à
  traiter ».
