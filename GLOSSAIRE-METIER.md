# Glossaire métier

Le vocabulaire de l'association et des vélos. Un mot par concept, et les synonymes à ne pas
employer.

Ce fichier sert d'abord aux assistants IA qui travaillent sur le dépôt : s'ils nomment les
choses comme nous, le code et les discussions restent lisibles. Il sert aussi à n'importe
qui débarque dans le projet.

Pour le vocabulaire informatique, voir [GLOSSAIRE-TECHNIQUE.md](./GLOSSAIRE-TECHNIQUE.md).
Pour les règles de décision, [CONCEPTION.md](./CONCEPTION.md).

## L'association

**Les Poto'Cyclettes** :
Association d'autoréparation de vélos, 100 % bénévole, à Mulhouse. Son activité principale,
ce sont les permanences : les adhérents y réparent leur vélo eux-mêmes, avec l'aide des
bénévoles et les outils de l'atelier. À côté, on récupère des vélos en don, on les répare
et on les revend, ou on les démonte pour pièces.
_Éviter_ : « atelier de réparation », « on répare votre vélo ». Ici chacun répare le sien.
« La boutique », « le magasin » : on ne vend pas, on revend ce qu'on nous donne.

**Permanence** :
Un créneau régulier où l'atelier ouvre aux adhérents, qui viennent réparer leur vélo
eux-mêmes avec l'aide des bénévoles. C'est le cœur de l'activité, bien avant les dons et
les ventes.

**Adhérent** :
Une personne membre de l'association. Les adhérents viennent réparer leur vélo pendant les
permanences, et élisent le Conseil en assemblée générale.
_Éviter_ : « client ».

**Bénévole** :
Une personne qui donne de son temps à l'association, notamment pour aider les adhérents
pendant les permanences. C'est aussi elle qui se sert de nos outils numériques.
_Éviter_ : « utilisateur » tout court dans les textes affichés, « employé », « staff ».

**Outils** :
Les outils de mécanique de l'atelier, mis à disposition des adhérents pendant les
permanences. Dans ce dépôt, le mot seul veut toujours dire ça.
_Éviter_ : « outils » tout court pour parler de logiciel. On dit « outils numériques », ou
on nomme la chose (la mini-app, le site).

**Atelier** :
Le lieu physique où se tiennent les permanences. Par extension, le contexte d'usage de nos
outils numériques : debout, au téléphone, les mains sales, avec un éclairage qui change.

**Conseil** :
L'instance qui décide pour l'association, de façon collégiale. Ses membres représentent les
adhérents et sont élus en assemblée générale. Un choix structurant s'y présente, il ne s'y
impose pas.

**Assemblée générale** :
La réunion des adhérents, où l'on élit le Conseil.

## Le parcours d'un vélo

**Don** :
L'entrée d'un vélo dans l'association. Un don a un donateur, une date, et produit une
fiche don.
_Éviter_ : « acquisition », « achat », « entrée de stock » pour parler de l'acte lui-même.

**Donateur** :
La personne qui donne un vélo. Distinct de l'acheteur, qui le récupère à la sortie.
_Dans le code_ : `donor`.

**Enregistrement** :
Le geste qui fait exister un vélo dans la base : une photo, une description, puis le
serveur lui attribue sa référence. Il suit un don du jour, ou rattrape un vélo du stock
dormant pendant une session d'inventaire, en saisie à rebours s'il porte déjà une référence
papier. Le plan de la mini-app l'appelle aussi « flux d'entrée ».
_Éviter_ : « entrée de stock », « création », « ajout ».
_Dans le code_ : `registration`, `registerBike`.

**Référence** :
L'identifiant d'un vélo, au format `AAMMJJ.NN` : la date d'entrée suivie d'un compteur du
jour. Par exemple `260707.03` pour le troisième vélo du 7 juillet 2026. Elle est générée
par le serveur au moment de l'enregistrement, jamais saisie à la main, sauf en saisie à
rebours. La `date_entree` se déduit toujours de la référence.
_Éviter_ : « numéro », « identifiant », « ID ». On dit la référence.
_Dans le code_ : `reference`.

**Statut** :
Où en est un vélo dans son parcours. Quatre valeurs, et les transitions sont contrôlées
côté serveur. On ne revient pas en arrière.

```
à traiter       → prêt à la vente, sorti ou démonté
prêt à la vente → sorti ou démonté
sorti, démonté  → fin du parcours
```

Un vélo peut donc sortir en l'état, ou partir au démontage sans avoir été réparé.
_Éviter_ : « état », qui désigne l'état mécanique du vélo. « En stock » pour la première
valeur : un vélo prêt à la vente est en stock lui aussi.
_Dans le code_ : `status`, qui vaut `to-process`, `ready-for-sale`, `out` ou `dismantled`.

**En stock** :
Tout vélo encore chez nous : à traiter ou prêt à la vente. C'est une notion déduite du
statut, pas une valeur du statut. C'est elle que vise la question « on a un vélo enfant en
stock ? ».

**Prêt à la vente** :
Le vélo est réparé et peut partir. C'est ce statut qui alimente la vitrine web.

**Sortie de stock** :
Le départ d'un vélo, par vente ou par don. Elle enregistre l'acheteur, le prix et le type
de sortie. C'est le miroir légal de la fiche don.
_Éviter_ : « suppression », « archivage ». Un vélo sorti reste en base.
_Dans le code_ : `exit`, avec `buyer`, `price` et `exitKind`, qui vaut `sale` ou `gift`.
On évite `sold` : un vélo peut sortir par don.

**Démonté** :
Le vélo a fini en pièces détachées. C'est une fin de parcours au même titre que la sortie.
_Éviter_ : « cassé », « détruit » seul. Le plan dit « démonté / détruit », on retient
démonté.

**Triage** :
Le verdict grossier posé à l'arrivée ou à l'inventaire : à vendre, à réparer, ou à
démonter. Il tient en quelques secondes.
_Éviter_ : de le confondre avec le diagnostic, ou avec le statut : un vélo trié « à
démonter » reste « à traiter » tant qu'on ne l'a pas démonté.
_Dans le code_ : `triage`, qui vaut `sell`, `repair` ou `dismantle`.

**Diagnostic** :
L'examen mécanique complet d'un vélo, 10 à 15 minutes. Il se fait au fil de l'eau, quand on
a le temps, et jamais en masse. Il se consigne au verso de la fiche vélo.

**Inventaire** :
Recenser ce qu'on a. Deux minutes par vélo. **Inventorier n'est pas diagnostiquer** :
l'inventaire dit ce qu'on a, le diagnostic dit ce qu'il faut réparer.

**Session d'inventaire** :
Une date au calendrier où les bénévoles rattrapent le stock en masse. Elle part avec les
outils numériques dans l'état où ils sont.

**Stock dormant** :
Les vélos arrivés avant le process actuel (2015 à 2024), largement anonymes et sans
diagnostic. On ne les rattrape pas en détail.
_Éviter_ : « vieux stock », « backlog ».

**Saisie à rebours** :
Enregistrer un vélo qui porte déjà une référence papier, en fournissant cette référence au
lieu de la laisser générer. C'est une exception, pas un mode normal : dans l'interface elle
se cache derrière un interrupteur.

## Les artefacts papier

Le papier n'est pas un vestige. C'est la source de vérité juridique, et le dernier recours
quand le numérique casse.

**Fiche don** :
Le document signé à l'entrée d'un vélo. Archivée, elle **fait foi légalement**. La base de
données n'en est qu'une copie de confort.

**Fiche vélo** :
La fiche plastifiée A5 recto-verso accrochée au vélo. Le recto identifie le vélo. Le verso
consigne son diagnostic et la façon dont il évolue : on l'appelle parfois la fiche
diagnostic. Un trombone marque le statut. La fiche porte la même référence que la fiche
don, et c'est cette référence qui fait la jointure entre les deux.

## Décrire un vélo

**Type de vélo** :
Trois facettes distinctes, à ne pas écraser dans un seul champ : le type (VTT, VTC, vélo de
ville), le public (adulte, enfant) et le genre de cadre (cadre haut, cadre bas dit "femme").
_Dans le code_ : `kind`, `audience` et `frame`.

**Changement de vitesses** :
Comment le vélo change de vitesse, s'il en a : `sans`, `sur le cadre`, ou `manettes au guidon`. C'est
une question qui revient souvent chez les acheteuses et les acheteurs.

**Taille de roue** :
Son unité dépend du vélo : en pouces pour les VTT, en convention française pour les vélos
de route (700C, 650B). On propose des valeurs normalisées autant que possible, et si on
peut la mesure ETRTO entre parenthèses. Celle-ci est universelle : c'est le diamètre de
la jante en millimètres, par exemple 622 pour une roue de 700C ou de 29 pouces. Champ
humain : on ne la devine pas depuis une photo, ce n'est pas fiable.

**État mécanique** :
Ce qui marche et ce qui ne marche pas sur le vélo. Il vit au verso de la fiche vélo, pas
en base de données : accrochée au vélo, la fiche a plus de chances d'être à jour qu'un
champ.
_Éviter_ : « statut », qui désigne la place du vélo dans son parcours.

**Marque, modèle, couleur** :
Les champs d'identification. Suggérés depuis la base via une liste de valeurs déjà saisies,
jamais imposés.
_Dans le code_ : `brand`, `model` et `colors` (un vélo peut en avoir plusieurs).

## Les logiciels tiers

**Teable** :
La base de données des vélos. C'est elle qui stocke les enregistrements. La mini-app lui
parle à travers le relais, jamais en direct.

**Paheko** :
Le logiciel de gestion de l'association : adhérents, compta. Rien à voir avec le stock de
vélos, mais il partage notre hébergement.

**WordPress** :
Le site public. Il héberge aussi le relais qui parle à Teable, et la vitrine des vélos
prêts à la vente.

**Vitrine web** :
La vue publique des vélos prêts à la vente, avec photos. Bonus assumé : si elle tombe, ce
n'est pas grave.

## À compléter

Ce glossaire ne couvre pas encore le lexique mécanique dont se servent les bénévoles à
l'établi (pièces, pannes courantes, niveaux de réparation). Il ne sert à rien que je
l'invente : il viendra d'une discussion à l'atelier.
