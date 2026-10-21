# Guide de conception

[Version jolie, mais peut-être pas à jour](https://claude.ai/artifact/JVCeHc6ZRrUdTeiN5YU2JN)

Comment on tranche, quand on construit un outil numérique pour l'asso.

Ce document ne décrit aucun projet. Pas de spec ici, pas de tuto : juste les règles de
décision, avec la raison derrière chacune. Elles sortent de deux endroits, le [plan de la
mini-app vélos](./docs/plans/gestion-des-velos.md) (v3, juillet 2026) et la fondation CSS livrée en octobre 2026.

Pour qui : le prochain bénévole qui reprend un outil numérique, et l'assistant IA qui bosse avec lui.
On ne suppose pas que vous êtes développeur professionnel. Les mots techniques sont
expliqués au passage, et repris dans [GLOSSAIRE-TECHNIQUE.md](./GLOSSAIRE-TECHNIQUE.md).

Si une règle vous paraît fausse, dites-le. Elles sont là pour être discutées.

## 1. La reprise commande tout

L'asso est 100 % bénévole. Celui qui écrit un outil numérique finira par partir, moi compris. C'est
la contrainte dont découle à peu près tout le reste.

- **Il faut toujours deux personnes qui comprennent.** Le nom technique c'est le *bus
  factor* : combien de gens peuvent quitter le projet avant que plus personne ne sache le
  faire tourner. On en veut au moins deux. Concrètement, un choix important se discute avec
  un second dev avant d'être fait. Un choix que personne d'autre ne comprend, ce n'est pas
  un choix, c'est une dette.
- **Des outils numériques modifiables sans moi.** Quelqu'un doit pouvoir changer un libellé, ajouter
  un champ ou corriger une couleur sans m'appeler. C'est le critère de réussite, avant
  l'élégance et avant la rapidité.
- **L'ennuyeux bat le malin.** Une solution banale se reprend facilement. Une solution
  astucieuse se paie au moment de la relire, et ce n'est pas celui qui l'a écrite qui paie.
- **Le code doit se lire en entier, en une soirée.** Vraiment le lire, pas le survoler. Si
  une partie ne passe plus dans une soirée, elle est trop grosse et il faut la couper.
- **Chaque dépendance a son plan de sortie, écrit avant qu'on l'adopte.** Une dépendance
  c'est du code écrit par d'autres qu'on installe dans le projet. Le plan de sortie répond
  à une seule question : si ce truc est abandonné dans deux ans, comment on s'en passe ?

## 2. Ça doit tenir debout même amputé

Chaque étape livre quelque chose d'utilisable, même si la suivante n'arrive jamais.

Ce n'est pas théorique. On a tenté une première fois de stocker les vélos dans Teable, une base de données en ligne. Ses
formulaires ont cassé du jour au lendemain, et ce qui a sauvé la mise c'est que les fiches
papier, elles, tournaient toujours.

- **Le papier est le dernier recours.** Les fiches plastifiées ont prouvé qu'elles
  survivent à tout. Le numérique n'en est qu'une copie de confort. Pour le juridique, c'est
  la fiche don archivée qui fait foi, point.
- **L'IA est un accélérateur, jamais un péage.** On veut lui faire deviner le type et la
  marque d'un vélo depuis sa photo, pour gagner du temps à la saisie. Le critère de
  réussite : si ça tombe en panne, personne ne s'en aperçoit. Le formulaire s'affiche vide
  et on remplit à la main, comme avant.
- **L'utilisateur a toujours raison.** Une valeur devinée par la machine n'écrase jamais
  ce qu'un humain a tapé. Pour ça, chaque champ retient deux choses : sa valeur, et qui l'a
  mise. L'IA n'a le droit d'écrire que là où l'humain n'a pas touché.
- **Même réflexe côté interface.** Une police qui ne se charge pas retombe sur celle du
  système, et le texte reste lisible. Une brique de mise en page qu'on ne règle pas prend
  un réglage par défaut.
- **Ce qui vaut pour l'utilisateur ne vaut pas pour le code.** Une configuration
  obligatoire qui manque (une adresse de serveur, une clé) fait échouer le programme tout
  de suite, avec un message clair. Un programme qui tourne de travers sans rien dire coûte
  bien plus cher à réparer.

## 3. Décider, c'est écrire ce qu'on ne fait pas

Un plan sans liste de refus, c'est un plan qui n'a rien tranché. Le refus s'écrit au même
endroit que la décision, avec sa raison. Trois exemples du plan vélos :

- **Pas de table de mouvements.** En comptabilité, on note chaque entrée et chaque sortie
  sur des lignes séparées. Ici non : un vélo c'est une ligne, il sort une fois, et sa
  sortie s'écrit sur cette même ligne. On perd en rigueur, on gagne en simplicité, et c'est
  un échange qu'on assume.
- **Pas de diagnostic complet des vélos qui dorment.** Examiner un vélo prend 10 à 15
  minutes. Le faire sur tout le stock d'un coup ne tient pas : on diagnostique au fil de
  l'eau, quand on a le temps.
- **Pas de devinette sur la taille de roue ni l'état mécanique.** La photo ne les donne pas
  de façon fiable. La taille de roue se saisit à la main, et l'état mécanique vit au verso
  de la fiche vélo, qui a plus de chances d'être à jour qu'un champ en base.

Un refus écrit, ça se rouvre le jour où un fait nouveau arrive. Un oubli, ça se redécouvre
en pleine construction, et là c'est moins drôle.

## 4. Choisir une dépendance

Rappel : une dépendance, c'est du code écrit par quelqu'un d'autre qu'on fait entrer dans
le projet. Les questions, dans cet ordre.

1. **Est-ce que le navigateur sait déjà le faire ?** Il en fait beaucoup plus qu'on croit.
   Les fenêtres modales, les suggestions de saisie, la détection d'un champ mal rempli :
   tout ça existe en HTML et en CSS, sans rien installer. On n'ajoute du code que pour ce
   que le navigateur ne sait pas faire.
2. **Catalogue figé, ou bibliothèque vivante ?** Certains projets sont des catalogues : une
   liste de valeurs ou de bouts de code, qu'on copie une fois et qui ne bougent plus.
   Ceux-là, on les copie carrément dans notre dépôt. On appelle ça *vendorer*. Le fichier
   copié garde en commentaire d'où il vient, sa version et sa licence. Résultat : aucune
   mise à jour à suivre, et rien qui casse tout seul un matin.
3. **Est-ce que ça part avec le produit, ou est-ce que ça reste sur notre machine ?** Un
   programme qui sert seulement à écrire le code (par exemple un vérificateur) ne part pas chez
   l'utilisateur. S'il est abandonné, le produit continue de fonctionner, on le remplace
   tranquillement. Une dépendance qui part dans le produit livré, elle, n'a pas ce luxe. On
   est donc beaucoup plus exigeant sur la seconde catégorie.
4. **Si le projet dort deux ans, est-ce que ça repart ?** Une installation qui échoue dans
   deux ans parce qu'un paquet a disparu, ce n'est pas un détail, c'est une panne.
5. **Le plan de sortie tient en combien de lignes ?** Si se débarrasser de la dépendance
   demande de réécrire la moitié du projet, ce n'est pas un plan de sortie, c'est un mur.

## 5. Le terrain c'est l'atelier, pas un bureau

La saisie se fait debout, au téléphone, avec un éclairage qui change et souvent les mains
sales. Ce qui suit ne se négocie pas.

- **On dessine pour le téléphone d'abord, l'ordinateur ensuite.** Jamais l'inverse. En
  partant du grand écran, on se retrouve toujours à rattraper le petit à coups de
  rustines.
- **48 pixels de haut minimum pour tout ce qui se tape.** C'est un plancher, jamais une
  variante : un bouton « petit » allège le texte et les marges, pas la hauteur. Un doigt
  ne rétrécit pas.
- **Jamais de texte plus petit que la taille par défaut dans un champ de saisie.** En
  dessous, iPhone grossit automatiquement la page quand on tape dedans, et on perd sa
  place.
- **Jamais bloquer une saisie.** Seul le strict nécessaire est obligatoire. Un bénévole qui
  n'arrive pas à valider son formulaire, c'est un bénévole qui repart au papier, et il a
  raison.
- **La date d'utilisation est fixée d'avance, et elle ne bouge pas.** On choisit le jour de
  la séance d'inventaire maintenant, pas quand l'outil numérique sera prêt. Le jour venu, on part
  avec ce qu'on a, même si c'est incomplet. Sinon la date recule indéfiniment et la séance
  n'a jamais lieu.

## 6. Le socle front

Cette partie s'adresse à qui écrit de l'interface. Le reste du guide vaut pour tout le
monde. Si les mots ne vous parlent pas, le
[glossaire technique](./GLOSSAIRE-TECHNIQUE.md) les reprend un par un.

### Les tokens

Un *token*, c'est une valeur de design qu'on a nommée : une couleur, un espacement, une
taille. En CSS ça s'écrit comme une variable, par exemple `--color-text-body`.

- **Deux étages.** En bas, des échelles de valeurs toutes faites, qu'on a copiées dans le
  projet (`--size-1`, `--size-2`, et ainsi de suite). Au-dessus, nos noms à nous, qui
  disent à quoi ça sert. On n'invente pas une échelle quand il en existe une.
- **Le nom dit d'abord le type, puis le rôle** : `--color-text-body`, `--size-tap-target`.
  Un numéro à la fin veut dire « le troisième barreau de l'échelle ». Un mot à la fin veut
  dire « l'espace intérieur d'un bouton ». On voit l'étage rien qu'au nom.
- **Nommer par le rôle, jamais par le rang.** Appeler une couleur `secondary` ou
  `tertiary`, ça désigne une place dans une liste. Le jour où on échange deux couleurs,
  toutes les mentions de `secondary` deviennent fausses, et pourtant rien ne plante. Des
  noms qui mentent sans casser, c'est le pire cas de figure.
- **Aucune couleur ni taille écrite en dur ailleurs que dans le fichier des tokens.** C'est
  ça qui permet de changer l'apparence du produit en ouvrant un seul fichier.

### La grammaire des classes

Une classe, c'est l'étiquette qu'on colle sur un bout de page pour pouvoir le styler. On
suit une convention stricte sur la façon de les nommer, pour que la structure se devine à
la lecture.

Un composant porte un nom en deux mots (`content-card`), ses parties un nom en un seul mot
(`title`), et on ne style une partie que si elle est **fille directe** du composant. Le
`>` veut dire exactement ça : l'enfant juste en dessous, pas le petit-enfant.

```html
<article class="content-card" data-variant="elevated">
	<h3 class="title">Vélo n° 042</h3>
</article>
```

Attention au piège : si vous glissez une balise entre le composant et sa partie, le `>` ne
correspond plus et le style disparaît, sans aucun message d'erreur.

Les déclinaisons d'un composant (principal, secondaire, danger) ne sont pas des classes en
plus : ce sont des attributs, écrits `data-variant="primary"`. L'avantage, c'est qu'une
déclinaison devient une donnée qu'on peut piloter depuis le code, au lieu d'assembler des
bouts de texte. Et une déclinaison ne change que des valeurs, jamais des règles : la règle
qui dessine le composant est écrite une seule fois.

### La cascade

La *cascade*, c'est la façon dont le navigateur départage deux règles CSS qui se
contredisent sur le même élément. Par défaut il regarde laquelle est la plus précise, ce
qui pousse à écrire des sélecteurs de plus en plus tordus pour gagner. Deux mécanismes récents
du CSS évitent ce jeu.

- **`@layer` range les règles par priorité, `@scope` limite leur territoire.** Les couches
  disent qui gagne, la portée dit où ça s'applique. Ce n'est pas le même travail, et les
  confondre coûte des heures.
- **Attention, c'est contre-intuitif : du CSS rangé dans aucune couche bat du CSS rangé
  dans une couche**, même s'il est beaucoup moins précis. C'est pour ça que chaque fichier
  déclare lui-même sa couche. Un fichier chargé tout seul, sans sa couche, gagnerait
  silencieusement sur tout le reste.
- **Un seul fichier liste tous les autres.** Deux listes, ça finit toujours par diverger, et
  personne ne sait plus laquelle fait foi.

### Pas d'orphelin

C'est le principe qui tranche le reste. Un fichier, une règle ou une exception qui existe
toute seule, sans rien de symétrique en face, c'est l'endroit où la cohérence va lâcher.

Trois décisions en découlent. Le CSS d'un composant vit dans le dossier de ce composant,
comme ça supprimer le dossier supprime aussi le CSS et on ne laisse pas de code mort
derrière soi. Le thème sombre vit dans le même fichier que le thème clair, sur la même
ligne, pour qu'on ne puisse pas en modifier un en oubliant l'autre. Et les briques de mise
en page respectent la convention de nommage comme tout le monde, au lieu de figurer sur
une liste d'exceptions que personne ne pense à mettre à jour.

## 7. Les promesses, on les rend vérifiables

- **Une affirmation qu'un relecteur ne peut pas vérifier doit devenir un test automatique,
  ou dégager.** « Les contrastes sont conformes » et « il n'y a aucune valeur écrite en
  dur » : à la lecture, ça ne se vérifie pas, on croit l'auteur sur parole. Ce sont deux
  petits programmes maintenant, et ils tournent avec `npm run verify`.
- **Le styleguide est le filet, pas une annexe.** C'est la page qui montre tous les
  composants avec toutes leurs déclinaisons. Un composant qui n'y figure pas n'existe pas.
- **Dire ce qui n'est pas vérifié.** Une vérification verte ne juge pas le rendu, ni le
  confort, ni la tenue sur un vrai téléphone. Ça, ça reste à faire à l'œil, et il faut
  l'annoncer plutôt que de laisser croire que tout est couvert.
- **Ce qui compte c'est le code livré, pas le récit qu'on en fait.** On juge un changement
  sur ce qu'il écrit dans les fichiers.

## 8. L'accessibilité, c'est le plancher

- **Du texte lisible sur son fond.** On mesure le rapport de luminosité entre les deux et
  on vise le seuil officiel (4,5 contre 1 pour du texte courant). Mesuré, pas estimé à
  l'œil : notre œil s'habitue, et il s'habitue mal.
- **Les contours qui veulent dire quelque chose doivent se voir** (le bord d'un champ, par
  exemple), à 3 contre 1 au minimum. Un simple trait de séparation décoratif n'a pas de
  seuil à tenir, et lui en imposer un durcirait l'apparence pour rien.
- **On doit toujours voir où on en est au clavier.** Quand on circule dans la page avec la
  touche Tab, l'élément sélectionné porte un contour visible. Y compris dans le mode très
  contrasté de Windows, où les ombres sont ignorées.
- **On respecte le réglage « moins d'animations »** que certaines personnes activent sur
  leur appareil, parce que le mouvement leur donne la nausée.
- **Tout doit être atteignable au clavier**, sans souris.

Ce n'est pas une liste de bonus. Une page qu'une personne ne peut pas utiliser, c'est une
page cassée.

## 9. Comment on écrit

- **On écrit pour un relecteur qui n'est pas développeur professionnel.** Ça vaut pour la
  documentation, les commentaires, les messages de commit et les descriptions de
  changement. Un mot technique s'explique la première fois qu'il apparaît, ou renvoie au
  [glossaire technique](./GLOSSAIRE-TECHNIQUE.md). S'il n'y est pas, on l'y ajoute. Une
  abréviation s'écrit en entier au moins une fois. Si une phrase n'est claire que pour
  celui qui l'a écrite, elle n'est pas finie.
- **En français** : la documentation, les commentaires, les messages de commit. Les noms
  dans le code (variables, fonctions, classes) restent en anglais.
- **Un commentaire, c'est l'exception.** Le code dit déjà *comment* ça marche. Le
  commentaire sert à dire *pourquoi*, surtout quand la raison ne se devine pas : une
  contrainte extérieure, un piège qu'on a rencontré, un lien vers la discussion qui a mené
  là. Pas de commentaire qui répète la ligne d'en dessous.
- **Pas de dette signalée sans accord.** Pas de `TODO` ni de `FIXME` posés tout seul dans
  son coin : on signale le problème à quelqu'un, et quelqu'un tranche.
- **Tabulations, fins de ligne Unix, retour à la ligne final.** Pour le plugin, c'est écrit
  dans `wp-plugin/.editorconfig`, que votre éditeur sait lire. Pour la mini-app, c'est
  Biome, le formateur, qui s'en charge.
- **Un fichier copié depuis l'extérieur ne s'édite pas.** Si on doit vraiment s'écarter de
  l'original, l'écart s'explique en haut du fichier, avec sa raison.
- **Une décision difficile à défaire s'écrit dans `docs/adr/`.** Une fiche courte : ce qu'on
  a décidé, ce qu'on a écarté, et pourquoi. Sans elle, le prochain qui passe « corrige » ce
  qui était voulu.

## La checklist d'ouverture

Sept questions avant la première ligne de code.

1. Qu'est-ce qui fonctionne déjà aujourd'hui, en papier ou autrement, et que le nouvel
   outil numérique ne doit surtout pas casser ?
2. Qu'est-ce qu'on décide de ne pas faire, et pour quelle raison ?
3. Si la personne qui code s'arrête demain, qui reprend ? Est-ce qu'elle a déjà regardé le
   projet et dit oui ?
4. Est-ce que chaque étape, prise toute seule, donne déjà quelque chose d'utilisable ?
5. Quelles dépendances on fait entrer, et comment on se débarrasse de chacune si elle pose
   problème ?
6. Quelles promesses on veut pouvoir vérifier automatiquement, au lieu de se croire sur
   parole ?
7. Quel jour on s'en sert pour de vrai ? On le fixe maintenant, et on ne le repousse pas
   parce que l'outil numérique n'est pas fini.

Si l'une des sept vous bloque, c'est maintenant qu'il faut en parler, pas dans trois mois.
