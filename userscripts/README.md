# Les userscripts des Poto'Cyclettes

Un userscript est un petit programme que le navigateur ajoute à une page web : préremplir un
champ, masquer un bloc, ajouter un bouton. Il agit seulement dans le navigateur où il est
installé, sans toucher au serveur du site. C'est notre façon d'adapter Paheko, dont on ne
peut pas modifier le code.

Tous les scripts sont rassemblés dans un **bundle**, `potocyclettes.user.js`, le fichier
que les postes installent. Il tourne sur `potocyclettes.paheko.cloud` et sur sa préprod,
`potocyclettes-preprod.paheko.cloud`.

Le dossier `src/demo/` contient trois exemples, pour apprendre, sur le site de
l'association. Ils ne tournent qu'en développement : les bénévoles ne les reçoivent pas.

Les mots techniques sont expliqués dans le [glossaire technique](../GLOSSAIRE-TECHNIQUE.md),
partie « Les userscripts ».


## Installer sur un poste

1. **Installer un gestionnaire de userscripts**, l'extension qui fait tourner les scripts.
   - Sur PC : [Violentmonkey](https://violentmonkey.github.io/) (Firefox, Chrome, Edge) ou
     Tampermonkey. Sous Chrome, il faut ensuite autoriser les userscripts dans les réglages
     de l'extension (`chrome://extensions`, puis « Détails »).
   - Sur iPad : l'app **Userscripts** sur l'App Store, puis l'activer dans Réglages ›
     Safari › Extensions.
2. **Ouvrir l'adresse du bundle** dans ce navigateur. Le gestionnaire propose de
   l'installer :
   <https://www.lespotocyclettes.com/wp-content/plugins/lespotocyclettes/userscripts/potocyclettes.user.js>

Ensuite, le gestionnaire vérifie lui-même s'il existe une version plus récente, en général
une fois par jour. On peut forcer la vérification depuis son menu.

> **Pas encore vérifié** : l'installation et la mise à jour sur l'iPad. À tester au premier
> déploiement.


## Développer

Il faut [Node.js](https://nodejs.org) 24 ou plus. Le dossier s'installe à part du reste du
dépôt : il n'a besoin d'aucune autre partie du projet.

```sh
cd userscripts
npm install
npm run dev
```

`npm run dev` recompile le bundle à chaque modification et le sert depuis votre machine,
démo comprise. La première fois, ouvrez l'adresse qu'il affiche,
`http://localhost:4173/dev-loader.user.js`, pour installer le **chargeur de
développement**. Sur ce navigateur, désactivez la copie installée depuis le site.
Désormais, chaque enregistrement recharge la page.

Pour voir la démo : <https://www.lespotocyclettes.com/nous-rejoindre/>.

Chrome peut demander l'autorisation d'accéder au réseau local : c'est votre machine,
acceptez.

Avant de pousser : `npm run verify` vérifie les types et lance les tests.


## Écrire un script

Un script est un fichier dans `src/paheko/`. Le plus simple tient en quelques lignes :

```ts
// src/paheko/bonjour.ts
import { defineUserScript } from "../lib/runUserScripts.ts";

export default defineUserScript({
	name: "bonjour",
	// Sur quelles pages tourner : une fonction qui reçoit l'adresse et répond oui ou non.
	match: (url) => url.pathname.startsWith("/admin/users/"),
	// Du CSS ajouté à la page (facultatif).
	styles: `h1 { color: rebeccapurple; }`,
	// Ce que fait le script (facultatif).
	run() {
		console.info("Bonjour depuis un userscript !");
	},
});
```

Puis on l'ajoute à la liste des scripts, dans `src/index.ts`.

La bibliothèque commune, dans `src/lib/`, fournit les briques. Chaque exemple de
`src/demo/` en montre une :

| Brique              | Rôle                                                 | Exemple                       |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| `styles`            | ajouter du CSS, sans JavaScript                      | `mode-cambouis.ts`            |
| `watchSelector`     | agir sur chaque élément voulu, même arrivé plus tard | `tarifs-en-chambres-a-air.ts` |
| `createButton`      | un bouton qui affiche son chargement et ses erreurs  | `tarifs-en-chambres-a-air.ts` |
| `match`             | choisir les pages, ou même la saison                 | `caritas-hiberne.ts`          |
| `waitQuerySelector` | attendre un élément avant d'agir                     | `caritas-hiberne.ts`          |

`src/demo/demo.test.ts` montre comment tester un script : `npm test` le lance avec les
autres tests.

`match` reçoit un objet [`URL`](https://developer.mozilla.org/fr/docs/Web/API/URL) :
`url.hostname`, `url.pathname`, `url.searchParams.get("id")`… `URLPattern`, l'outil du
navigateur qui compare une adresse à un motif, pourrait servir un jour. Son support par
Safari sur iPad reste à vérifier avant de l'employer.


## Les règles

- **Aucune clé d'API, aucun mot de passe.** Le fichier est public, n'importe qui peut le
  lire. Et il n'en a pas besoin : il tourne dans l'onglet de la personne connectée, avec
  ses droits à elle.
- **Viser les champs par leur attribut `name`**, plus stable qu'une classe CSS ou une
  position dans la page.
- **Ne remplir qu'un champ vide.** Ce qu'une personne a tapé ne s'écrase pas.
- **En cas de doute, ne rien faire.** Si un élément attendu manque, le script s'arrête et
  la page reste complète. Une erreur de script ne casse rien : elle s'affiche dans la
  console du navigateur, les autres scripts continuent.
- **Paheko évolue.** Une mise à jour de Paheko peut renommer un champ et rendre un script
  muet. Vérifier ses scripts après chaque mise à jour de Paheko.


## Viser un autre site

Ajouter son adresse à `MATCHES`, dans `vite.config.ts`. Le chargeur de développement suit
tout seul : Vite le fabrique à partir de la même liste.


## Publier

Un push sur `main` déclenche le déploiement du site. Il compile le bundle vers
`wp-plugin/userscripts/` et l'envoie avec le plugin. La version (`@version`) prend la date
et l'heure de compilation, par exemple `2026.1128.1432` : elle augmente à chaque
déploiement, et c'est ce qui déclenche la mise à jour des postes.

Pour compiler à la main : `npm run build`.

### Si un poste ne se met pas à jour

Après le premier déploiement, publier une seconde version et vérifier qu'elle arrive sur le
PC et sur l'iPad. Si elle n'arrive pas, le serveur garde peut-être le fichier en cache. Le
remède serait un fichier `wp-plugin/userscripts/.htaccess` (réglages du serveur Apache) :

```apache
<FilesMatch "\.user\.js$">
	Header set Cache-Control "no-cache"
</FilesMatch>
```

Il faudrait alors l'autoriser dans le `.gitignore` de la racine, qui ignore les fichiers
dont le nom commence par un point.
