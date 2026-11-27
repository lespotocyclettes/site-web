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

## Fait : les styles de texte

Un token par rôle, écrit pour le raccourci `font` : `font: var(--text-label)`. Il y a
`--text-body`, `--text-label`, `--text-caption`, `--text-code`, quatre titres à deux
paliers, et `--text-reference`, en chasse fixe, que porte le composant `.bike-reference`.
Le pourquoi est dans la [fiche 0003](../adr/0003-styles-de-texte-en-raccourci-font.md).

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

## Fait : 1. Recherche

Le champ texte (référence, marque, modèle), les chips de statut et de public
(`ToggleGroup`, des cases à cocher), la grille de vignettes photo (référence, marque ·
modèle, type · public, statut). La recherche vit dans
l'adresse. « En stock » n'est pas une chip : c'est la recherche où mène l'onglet Recherche,
à traiter et prêt à la vente cochés.

Restent pour plus tard :
- une **pagination**, quand le vrai relais renverra des centaines de vélos ;
- un **délai avant d'envoyer la requête** pendant la frappe. Aujourd'hui, chaque lettre
  lance une recherche, ce qui ne coûte rien contre le faux relais. Contre le vrai, à
  décider avec l'incrément 4.

## Fait : 2. Fiche + actions

Le recto à l'écran : la première photo, plafonnée à 70 % de la hauteur de la fenêtre, puis
la même tête que la carte de recherche (`BikeIdentity` : la référence, marque · modèle,
type · public, statut). Le h1 est la référence, dans la barre du haut : elle s'affiche
avant le chargement du vélo et reste en vue quand on fait défiler. Une seconde carte, légendée « Détails », porte les autres
champs, un champ vide affiché, atténué, avec un tiret (`.detail-list`). Les actions, à
droite de la référence (`ContentCard.Title actions`), suivent `getNextStatuses`. Un tap ne
change rien : il ouvre une fenêtre modale (`ModalDialog`), qui demande confirmation ou
porte le formulaire de sortie (vente ou don en chips radio, acheteur requis, prix requis
pour une vente). Un vélo sorti montre sa sortie. Le lien retour ramène à la recherche
d'où l'on vient, filtres et défilement compris ; ouverte par un lien partagé, la fiche
renvoie à la recherche en stock (`navigation/back-link.ts`). Pour le savoir, chaque entrée
de l'historique note son origine (`navigation/entry-origin.ts`).

Restent pour plus tard :
- les **photos suivantes**, qui arrivent avec l'enregistrement ;
- le **verso** (suivi atelier, état mécanique), qui vit sur la fiche plastifiée.

## Fait : la mise en page mobile

Une barre par écran, jamais deux. Un écran racine, qu'on ouvre depuis la barre du bas, n'a
que cette barre : aujourd'hui, la recherche. Un écran enfant n'a que la barre du haut, avec
le retour : la fiche et l'enregistrement. La barre du bas porte l'onglet Recherche et le
bouton « Enregistrer ». L'enregistrement n'est pas un onglet mais une tâche, ouverte en
plein écran, qu'on quitte par son retour. Retoucher l'onglet Recherche, quand on y est
déjà, met le focus dans le champ, sans toucher aux filtres.

C'est la page entière qui défile, et les barres restent collées au bord : le retour de la
fiche retrouve ainsi la position de la recherche (`src/screen/screen-layout.tsx`).

Pas encore vérifié sur un vrai téléphone : la barre d'accueil de l'iPhone, le clavier qui
recouvre la barre du bas, le clavier qui s'ouvre quand on retouche l'onglet Recherche.

```
RACINE · Recherche         ENFANT · Fiche vélo
┏━━━━━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ □ Chercher un vélo…  ┃   ┃ ← Retour             ┃
┃ ▪ à traiter  ▪ prêt  ┃   ┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ ┌──────┐  ┌──────┐   ┃   ┃ ░░░░░░ photo ░░░░░░░ ┃
┃ │ vélo │  │ vélo │   ┃   ┃ 261027.01   [Action] ┃
┃ └──────┘  └──────┘   ┃   ┃ Peugeot · ville      ┃
┣━━━━━━━━━━━━━━━━━━━━━━┫   ┃                      ┃
┃    🔍         ➕     ┃   ┃ DÉTAILS              ┃
┃Recherche  Enregistrer┃   ┃ Couleur   rouge      ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━━━━━┛
```

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

**Le retour, pendant et après l'enregistrement : un flux borné.** Pendant la saisie, le
retour remonte d'une étape (via le rembobinage d'unreel, déjà prévu). Une fois
l'enregistrement validé, ses étapes sortent de l'historique : le retour depuis la
confirmation saute par-dessus et ramène à l'écran d'avant. Le navigateur ne supprime pas
d'entrée, mais on peut revenir avant le flux puis écraser :

```
AVANT LA VALIDATION              APRÈS LA VALIDATION

Recherche                        Recherche
Étape A ┐                        Confirmation   ← remplace l'étape A ;
Étape B │ flux borné, profondeur 3                 B et C ne sont plus atteignables
Étape C ┘ ← on est ici           retour depuis la confirmation → Recherche
```

À la validation : `history.go(-profondeur)`, puis l'écran de confirmation prend la place.
Chaque entrée note déjà son origine dans `history.state` ; elle y ajoutera
`flow: { name, depth }`. Le motif s'appelle *bounded task flow* chez Oracle ADF,
`popUpTo` dans la navigation Android.

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

Deux suites possibles de la mise en page mobile, à reprendre après un essai à l'atelier :

- **masquer les barres quand on fait défiler la page vers le bas**, et les rendre quand on
  remonte. Le gain est mince, 3 à 4rem, et une barre qui bouge déplace le bouton sous le
  pouce ;
- **un bouton « ajouter » sur la recherche**, si le bouton « Enregistrer » de la barre du
  bas ne se trouve pas assez bien.

Une piste, à co-signer (règle 4 de CONCEPTION.md) : passer le routage à
[TanStack Router](https://tanstack.com/router). Notre routage par `#` (`navigation/`) en
reprend déjà les idées : une route par fichier, des paramètres décodés et typés,
l'historique du navigateur. Le flux borné et l'origine d'une entrée y seraient plus simples
à poser, et son historique en mémoire se teste sans navigateur. À peser contre la question
4 de la règle : une dépendance qui part dans le produit livré.

## Avant la relecture par le second dev

- Co-signer la [fiche 0002](../adr/0002-dependances-mini-app.md) (les dépendances).
- Passer unreel du lien vers son dossier à une archive copiée dans `app/vendor/unreel/`.
