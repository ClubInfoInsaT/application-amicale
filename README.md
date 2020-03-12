# CAMPUS - Application pour l'Amicale

Créée pendant l'été 2019, cette application compatible Android et iOS permet aux étudiants d'avoir un accès facile aux informations du campus :
 - News de l'amicale
 - État des machines à laver
 - Liste des événements sur le campus
 - Stock du Proximo
 - Emploi du temps
 - Menu du RU
 - Disponibilité des salles libre accès
 - Réservation des Bib'Box
 
Ce dépot contient la source de cette application, modifiable par les étudiants de l'INSA Toulouse, sous licence GPLv3.

## Contribuer

Vous voulez influencer le développement ? C'est très simple !

Pas besoin de connaissance, il est possible d'aider simplement en proposant des améliorations ou en rapportant des bugs par mail (vergnet@etud.insa-toulouse.fr) ou sur [cette page](https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues), en vous connectant avec vos login INSA.

Si vous avez assez de connaissances et vous souhaitez proposer des modification dans le code, installez l'application sur votre machine, réalisez votre modification et créez une 'pull request'.

## Technologies Utilisées
Cette application est faite en JavaScript avec React Native (framework Open Source créé par Facebook), combinée avec Expo.

Cette combinaison permet de n'avoir qu'un seul code JavaScript à écrire pour Android et iOS. Pour compiler pour la plateforme souhaitée, il suffit d'effectuer une commande, qui envoie le code sur les serveurs d'Expo pour compilation (voir section Installer). Plus besoin de Mac pour développer une application iOS ! (Mais toujours besoin d'un pour publier sur l'App store...)


## Installer l'application depuis ce dépot

**Avant de commencer, installez git, node et npm sur votre machine, puis clonez ce dépot.**

### Téléchargement du dépot et des dépendances

Il est conseillé d'utiliser un logiciel comme **PHPStorm** (logiciel pro gratuit pour les étudiants) pour éditer l'application car ce logiciel est compatible avec les technologies utilisées.

Une fois le dépot sur votre machine, ouvrez le projet dans PHPStorm, ouvrez le terminal et tapez `npm install`. Ceci installera toutes les dépendances listées dans le fichier _package.json_. Cette opération peut prendre quelques minutes et utilisera beaucoup d'espace disque (plus de 300Mo).

### Lancement de l'appli

#### En console

Ouvrez simplement une console dans le répertoire du projet et tapez :

`expo start`

Cette commande va démarrer le Metro Bundler permettant de lancer l'appli. Attendez quelques instants, quand un QR code apparait, l'application est prête à être lancée sur votre téléphone.

**Ne stoppez pas le Metro Bundler dans la console a chaque changement !** Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer pour des petits changements ! Il est seulement nécessaire de redémarrer le Metro Bundler quand vous changez des librairies ou des fichiers.

#### Directement avec PHPStorm

Si vous n'aimez pas la console et voulez utiliser le merveilleux bouton play de PHPStorm, il faut le paramétrer. Nous utilisons ici expo, il faut donc dire à PHPStorm de lancer une commande expo quand nous cliquons sur le bouton play.

Pour cela, cliquez sur **Edit Configurations** en haut à droite, dans la nouvelle fenêtre, cliquez sur **+**, et choisissez **React Native**.

Donnez un petit nom à cette configuration, décochez **Build and launch application** (nous utilisons expo pour ça, pas react native), mettez `127.0.0.1` dans le champ **Bundler Host**, et `19001` dans **Bundler Port**.

Ensuite, dans **Before Launch**; cliquez sur **+** pour ajouter une nouvelle configuration, et choisissez **Start React Native Bundler** si il n'est pas déjà présent. Une fois ajouté, cliquez dessus, puis sur le bouton éditer (une icone de crayon). Dans la nouvelle fenetre, choisissez **npm script** dans le champ **Command** et **start** dans **Script**. Vérifiez que vous utilisez bien l'interpreteur Node associé au projet (pour utiliser les bonnes dépendances installées précédement), et cliquez sur OK.

[Plus d'informations ici](https://www.jetbrains.com/help/phpstorm/react-native.html)

Le projet est maintenant pret, quand vous cliquez sur run (ou shift+F10), le projet sera lancé (cela peut prendre plusieurs minutes).
Quand un QR code apparait, vous pouvez tester sur un appareil.

**Ne stoppez pas le Metro Bundler dans la console a chaque changement !** Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer pour des petits changements ! Il est seulement nécessaire de redémarrer le Metro Bundler quand vous changez des librairies ou des fichiers.

### Tester sur un appareil

Assurez vous d'avoir installé et lancé le projet comme expliqué plus haut.

#### Émulateur android

[Suivez la procédure sur ce lien pour installer un émulateur](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/).

Une fois l'emulateur installé et démarré, lancez le projet, puis appuyez sur la touche **a** dans la console, cela lancera l'aplication dans l'émulateur.

#### Appareil Physique

Installez l'application **Expo** sur votre appareil (android ou iOS), assurez vous d'avoir démarré le projet et d'avoir votre machine de développement et le téléphone sur le même réseau wifi (non publique). Ouvrez l'application expo, Votre projet devrait apparaitre dans la liste. Cliquez dessus et c'est bon !

Si vous utilisez le réseau Wifirst des résidences INSA (ou tout autre wifi publique), il y a une méthode très simple pour créer un réseau privé entre votre PC et votre téléphone (en tout cas avec un téléphone android). Connectez votre téléphone en Wifi au réseau, puis connectez le en USB à votre PC. Une fois connecté, allez dans les paramètres et activez le "USB Tethering". Votre PC est maintenant connecté en réseau filaire à votre téléphone, qui lui est connecté à Internet par la wifi. Si vous voulez connecter d'autres appareils, il suffit de créer un Hotspot sur votre PC et de connecter vos autres appareils à ce Hotspot. Profitez de votre réseau privé dans votre Promolo !

## Compilation

Avant de compiler, créez vous un compte Expo. Ensuite, lancez le Metro Bundler et connectez vous a votre compte dans la console (les touches sont indiquées).

Pour compiler sur android, vous avez deux solutions:
 - Vous voulez générer un `.apk` pour pour l'installer sur votre téléphone, lancez cette commande dans un terminal dans le projet : `expo build:android`. Cette commande va générer les paquets nécessaires à Expo et les envoyer sur leurs serveurs. Ne touchez à rien pendant la création des paquets (cela peut prendre une à deux minutes). Une fois que vous voyez écrit `Build in progress...`, vous pouvez fermer votre console : les serveurs ont pris la main et vous avez un lien pour analyser la progression. Ce processus dure en général 8 minutes. Si vous ne fermez pas la console, vous aurez un lien direct pour télécharger le fichier `.apk`, sinon connectez vous sur votre compte Expo, rubrique Builds pour le télécharger.
 
 - Vous voulez compiler pour ensuite publier sur le Play Store, lancez cette commande dans un terminal dans le projet : `expo build:android -t app-bundle`. Cette commande fait exactement la même chose que la précédente à une chose près. Vous obtiendre un fichier `.aab`, qui est un format optimisé pour le Play Store. Ce fichier est plus volumineux mais permet au Play Store de générer les apk les plus optimisés possible pour différentes architectures de téléphone.
 

Pou compiler sur iOS, vous aurez besoin du compte développeur de l'amicale car un tel compte est payant.
