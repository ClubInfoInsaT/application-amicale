# Installer l'application depuis ce dépot

**Vous allez devoir installer git, node et npm sur votre machine, puis cloner ce dépot.**

## Table des matières
* [Installation de Git](#git)
* Installation de node
* Installation de expo-cli
    * Configuration de NPM
    * Installation
* Téléchargement du dépot
* Téléchargement des dépendances
* Lancement de l'appli
    * En console
    * Directement avec PHPStorm
* Tester sur un appareil
    * Émulateur android
    * Appareil Physique
* Compilation

<a name="git"></a>
## Installation de Git

Entrez la commande suivante pour l'installer :
```shell script
sudo apt install git
```

## Installation de node

Vous devez avoir une version de node > 12.0.
Pour cela, vérifiez avec la commande :
```shell script
nodejs -v
```

Si ce n'est pas le cas, entrez les commandes suivantes pour installer la version 12 ([plus d'informations sur ce lien](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)):

```shell script
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Installation de expo-cli

### Configuration de NPM
Il est nécessaire d'installer le paquet npm expo-cli de manière globale au système. Il est faut donc avoir les droits root pour l'installer. Une manière de contourner cette limitation est de changer le répertoire utilisé par npm pour les paquet globaux. Pour cela, procédez comme suit :

Créez un dossier pour les paquets globaux  :
```shell script
mkdir ~/.npm-global
```
Configurez npm pour qu'il utilise ce nouveau dossier :
```shell script
npm config set prefix '~/.npm-global'
```
Ouvrez le fichier .profile dans votre dossier home (ou créez le si il n'existe pas) et ajoutez ces lignes à la fin pour ajouter les paquets globaux à votre PATH.
```shell script
NPM_STORE="${HOME}/.npm-global"
PATH="$PATH:$NPM_STORE/bin"
```
Il est possible d'ajouter ces lignes dans le .bashrc a la place du .profile si vous n'utilisez expo qu'en console. Mais pour pouvoir l'utiliser depuis PhpStorm, il est necessaire de mettre à jour le PATH globalement avec le .profile et pas seulement pour les terminaux avec le .bashrc.

Redémarrez votre système (ou simplement logout/login) pour appliquer ces changements.

### Installation

Vous pouvez maintenant installer expo-cli sans problèmes avec la commande suivante :

```shell script
npm install -g expo-cli
```

## Téléchargement du dépot

Clonez ce dépot à l'aide de la commande suivante :
````shell script
git clone https://git.etud.insa-toulouse.fr/vergnet/application-amicale.git
````

## Téléchargement des dépendances

Une fois le dépot sur votre machine, ouvrez le projet dans PHPStorm, ouvrez le terminal et tapez : 
````shell script
npm install
````
Ceci installera toutes les dépendances listées dans le fichier _package.json_. Cette opération peut prendre quelques minutes et utilisera beaucoup d'espace disque (plus de 300Mo).

## Lancement de l'appli

Il est conseillé d'utiliser un logiciel comme **PHPStorm** (logiciel pro gratuit pour les étudiants) pour éditer l'application car ce logiciel est compatible avec les technologies utilisées.

### En console

Ouvrez simplement une console dans le répertoire du projet et tapez :

````
expo start
````

Cette commande va démarrer le Metro Bundler permettant de lancer l'appli. Attendez quelques instants, quand un QR code apparait, l'application est prête à être lancée sur votre téléphone.

**Ne stoppez pas le Metro Bundler dans la console à chaque changement !** Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer pour des petits changements ! Il est seulement nécessaire de redémarrer le Metro Bundler quand vous changez des librairies ou des fichiers.

### Directement avec PHPStorm

Si vous n'aimez pas la console et voulez utiliser le merveilleux bouton play de PHPStorm, il faut le paramétrer. Nous utilisons ici expo, il faut donc dire à PHPStorm de lancer une commande expo quand nous cliquons sur le bouton play.

Pour cela, cliquez sur **Edit Configurations** en haut à droite, dans la nouvelle fenêtre, cliquez sur **+**, et choisissez **React Native**.

Donnez un petit nom à cette configuration, décochez **Build and launch application** (nous utilisons expo pour ça, pas react native), mettez `127.0.0.1` dans le champ **Bundler Host**, et `19001` dans **Bundler Port**.

Ensuite, dans **Before Launch**; cliquez sur **+** pour ajouter une nouvelle configuration, et choisissez **Start React Native Bundler** si il n'est pas déjà présent. Une fois ajouté, cliquez dessus, puis sur le bouton éditer (une icone de crayon). Dans la nouvelle fenetre, choisissez **npm script** dans le champ **Command** et **start** dans **Script**. Vérifiez que vous utilisez bien l'interpreteur Node associé au projet (pour utiliser les bonnes dépendances installées précédement), et cliquez sur OK.

[Plus d'informations ici](https://www.jetbrains.com/help/phpstorm/react-native.html)

Le projet est maintenant pret, quand vous cliquez sur run (ou shift+F10), le projet sera lancé (cela peut prendre plusieurs minutes).
Quand un QR code apparait, vous pouvez tester sur un appareil.

**Ne stoppez pas le Metro Bundler dans la console a chaque changement !** Toutes les modifications sont appliquées automatiquement, pas besoin de stopper et de redémarrer pour des petits changements ! Il est seulement nécessaire de redémarrer le Metro Bundler quand vous changez des librairies ou des fichiers.

## Tester sur un appareil

Assurez vous d'avoir installé et lancé le projet comme expliqué plus haut.

### Émulateur android

[Suivez la procédure sur ce lien pour installer un émulateur](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/).
expo start
Une fois l'emulateur installé et démarré, lancez le projet, puis appuyez sur la touche **a** dans la console, cela lancera l'aplication dans l'émulateur.

### Appareil Physique

Installez l'application **Expo** sur votre appareil (android ou iOS), assurez vous d'avoir démarré le projet et d'avoir votre machine de développement et le téléphone sur le même réseau wifi (non publique). Ouvrez l'application expo, Votre projet devrait apparaitre dans la liste. Cliquez dessus et c'est bon !

Si vous utilisez le réseau Wifirst des résidences INSA (ou tout autre wifi publique), il y a une méthode très simple pour créer un réseau privé entre votre PC et votre téléphone (en tout cas avec un téléphone android). Connectez votre téléphone en Wifi au réseau, puis connectez le en USB à votre PC. Une fois connecté, allez dans les paramètres et activez le "USB Tethering". Votre PC est maintenant connecté en réseau filaire à votre téléphone, qui lui est connecté à Internet par la wifi. Si vous voulez connecter d'autres appareils, il suffit de créer un Hotspot sur votre PC et de connecter vos autres appareils à ce Hotspot. Profitez de votre réseau privé dans votre Promolo !

## Compilation

Avant de compiler, créez vous un compte Expo. Ensuite, lancez le Metro Bundler et connectez vous a votre compte dans la console (les touches sont indiquées).

Pour compiler sur android, vous avez deux solutions:
 - Vous voulez générer un `.apk` pour pour l'installer sur votre téléphone, lancez cette commande dans un terminal dans le projet : `expo build:android`. Cette commande va générer les paquets nécessaires à Expo et les envoyer sur leurs serveurs. Ne touchez à rien pendant la création des paquets (cela peut prendre une à deux minutes). Une fois que vous voyez écrit `Build in progress...`, vous pouvez fermer votre console : les serveurs ont pris la main et vous avez un lien pour analyser la progression. Ce processus dure en général 8 minutes. Si vous ne fermez pas la console, vous aurez un lien direct pour télécharger le fichier `.apk`, sinon connectez vous sur votre compte Expo, rubrique Builds pour le télécharger.
 
 - Vous voulez compiler pour ensuite publier sur le Play Store, lancez cette commande dans un terminal dans le projet : `expo build:android -t app-bundle`. Cette commande fait exactement la même chose que la précédente à une chose près. Vous obtiendre un fichier `.aab`, qui est un format optimisé pour le Play Store. Ce fichier est plus volumineux mais permet au Play Store de générer les apk les plus optimisés possible pour différentes architectures de téléphone.
 

Pou compiler sur iOS, vous aurez besoin du compte développeur de l'amicale car un tel compte est payant.


[reference]: ##Installation de Git
