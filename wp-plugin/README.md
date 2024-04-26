# Les PotoCyclettes

Ce plugin contient :
- des blocks wordpress personnalisés
- des styles globaux

## Pour développer

### Installation de l'environnement de dev

- Installer Git et/ou [Github Desktop](https://desktop.github.com/)
- Installer [Visual Studio Code (VS Code)](https://code.visualstudio.com/)
- Installer [WP-Local](https://localwp.com/)
- Installer nodejs. [Instructions pour windows](https://learn.microsoft.com/fr-fr/windows/dev-environment/javascript/nodejs-on-windows)

### Mise en place du projet

Cloner [le projet](https://github.com/lespotocyclettes/site-web) à l'aide de git ou github desktop

A l'aide de WP-Local, installer un nouveau site wordpress
- puis y installer une sauvegarde du site actuel via WPvivid Backup Plugin (voir avec Géraud pour les instructions)

A l'aide de Visual Studio Code (VS Code)
- copier le fichier `.env.example` en `.env` et remplacer son contenu pour correspondre à votre installation locale

A l'aide d'un terminal, aller dans le dossier du plugin et :
- exécuter `npm install` pour installer les dépendances du projets

### Développer

1. Démarrer le serveur dans WP Local
2. à l'aide d'un terminal, aller dans le dossier du plugin et exécuter `npm run dev`, ce qui observera les changements sur les fichiers et les injectera dans le site wordpress sur votre machine
3. ouvrir le projet dans VS Code

### Déployer

1. créer un commit git et le pousser [sur le dépôt en ligne](https://github.com/lespotocyclettes/site-web)
2. cela va déclencher un déploiement automatique sur le site, opération visible [dans les actions github](https://github.com/lespotocyclettes/site-web/actions)
	- ce déploiement automatique est décrit dans le dossier [.github/workflows/main.yml](/.github/workflows/main.yml) de ce même projet
3. et voilà !
