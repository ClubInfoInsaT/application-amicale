# Application pour l'Amicale

Créée pendant l'été 2019, cette application compatible Android et iOS permet aux étudiants d'avoir un accès facile aux informations du campus :
 - News de l'amicale
 - État des machines à laver
 - Stock du Proximo
 - Emploi du temps
 - Menu du RU

Ce dépot contient les sources de cette application, modifiable par les étudiants de l'INSA Toulouse, sous licence GPLv3.

## Contribuer

Vous voulez influencer le développement ? C'est très simple !

Pas besoin de connaissance, il est possible d'aider simplement en proposant des améliorations ou en rapportant des bugs par mail (vergnet@etud.insa-toulouse.fr) ou sur [cette page](https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues), en vous connectant avec vos login INSA.

Si vous avez assez de connaissances et vous souhaitez proposer des modifications dans le code, installez l'application sur votre machine, réalisez votre modification et créez une 'pull request'.

## Technologies Utilisées
Cette application est faite en JavaScript avec React Native (framework Open Source créé par Facebook), combinée avec Expo.

Cette combinaison permet de n'avoir qu'un seul code JavaScript à écrire pour Android et iOS. Pour compiler pour la plateforme souhaitée, il suffit d'effectuer une commande, qui envoie le code sur les serveurs d'Expo pour compilation (voir section Installer). Plus besoin de Mac pour développer une application iOS !


## Installer l'application depuis ce dépot

**Avant de commencer, installez git et npm sur votre machine, puis clonez ce dépot.**

### Téléchargement du dépot et des dépendances

Il est conseillé d'utiliser un logiciel comme **PHPStorm** (logiciel pro gratuit pour les étudiants) pour éditer l'application car ce logiciel est compatible avec les technologies utilisées.

Une fois le dépot sur votre machine, ouvrez le projet dans PHPStorm, ouvrez le terminal et tapez `npm install`. Ceci installera toutes les dépendances listées dans le fichier _package.json_. Cette opération peut prendre quelques minutes et utilisera beaucoup d'espace disque (plus de 400Mo).

**--> /!\ Pour pouvoir changer de mode nuit/jour dynamiquement sans redémarrer l'application, j'ai été obligé de modifier une librairie. Il est possible que l'appplication plante si vous ne refaites pas les modifications vous même /!\ <--**

Ceci est temporaire (on espère), car cette modification devrait être implémentée dans la librairie originale (un jour...).

En attendant, allez dans le dossier de la librairie **native-base-shoutem-theme**, et ouvrez le fichier _index.js_ et _src/connectStyle.js_. Ensuite, faites les modifications [comme indiqué ici](https://github.com/GeekyAnts/theme/pull/5/files/91f67c55ca6e65fe3af779586b506950c9f331be#diff-4cfc2dd4d5dae7954012899f2268a422).

Ces modifications ont été acceptées dans la librairie originale, mais pas encore présentes dans la version sur npm.

### Paramétrage de PHPStorm

Il faut maintenant paramétrer PHPStorm pour pouvoir lancer facilement l'application. Nous utilisons ici expo, il faut donc dire à PHPStorm de lancer une commande expo quand nous cliquons sur le bouton play.

Pour cela, cliquez sur **Edit Configurations** en haut à droite, dans la nouvelle fenêtre, cliquez sur **+**, et choisissez **React Native**.

Donnez un petit nom à cette configuration, décochez **Build and launch application** (nous utilisons expo pour ça, pas react native), mettez `127.0.0.1` dans le champ **Bundler Host**, et `19001` dans **Bundler Port**.

Ensuite, dans **Before Launch**; cliquez sur **+** pour ajouter une nouvelle configuration, et choisissez **Start React Native Bundler** si il n'est pas déjà présent. Une fois ajouté, cliquez dessus, puis sur le bouton éditer (une icone de crayon). Dans la nouvelle fenêtre, choisissez **npm script** dans le champ **Command** et **start** dans **Script**. Vérifiez que vous utilisez bien l'interpreteur Node associé au projet (pour utiliser les bonnes dépendances installées précédement), et cliquez sur OK.

[Plus d'informations ici](https://www.jetbrains.com/help/phpstorm/react-native.html)

Le projet est maintenant prêt, quand vous cliquez sur run (ou shift+F10), le projet sera lancé (cela peut prendre plusieurs minutes).
Une fois lancé, vous pouvez tester sur un appareil.

### Tester sur un appareil

Assurez vous d'avoir installé et lancé le projet comme expliqué plus haut.

#### Émulateur android

[Suivez la procédure sur ce lien](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/).

Une fois l'emulateur installé et démarré, lancez le projet, puis appuyez sur la touche **a** dans la console _Run_, cela lancera l'aplication dans l'émulateur.

**Ne stoppez pas l'application depuis PhpStorm ! Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer !**

#### Appareil Physique

Installez l'application **Expo** sur votre appareil (android ou iOS), assurez vous d'avoir démarré le projet et d'avoir votre machine de développement et le téléphone sur le même réseau wifi (non public). Ouvrez l'application expo, votre projet devrait apparaitre dans la liste. Cliquez dessus et c'est bon !

**Ne stoppez pas l'application depuis PhpStorm ! Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer !**


## Compilation

Pour compiler sur android, tapez la commande `expo build:android` dans une terminal dans le projet. Ensuite attendez.

Pou compiler sur iOS, vous aurez besoin du compte développeur de l'amicale.
