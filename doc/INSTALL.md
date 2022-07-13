# Installer l'application sur ta machine

Si tu as un problème ou une question, merci de me contacter par mail : [app@amicale-insat.fr](mailto:app@amicale-insat.fr)

Ce guide a été testé sur Linux (Ubuntu 20.04).
Si tu utilises Windows, débrouille-toi ou installe Linux.

## ⚠️ Avant de commencer, merci de te familiariser avec [les bases !](LINKS.md)

# Table des matières
* [1. Installation de Git](#1-installation-de-git)
* [2. Installation de  React Native](#2-installation-de-react-native)
* [3. Installation de l'application](#3-installation-de-lapplication)
    * [3.1 Téléchargement du dépot](#31-téléchargement-du-dépôt)
    * [3.2 Installation des dépendances](#32-installation-des-dépendances)
* [4. Lancement de l'application](#4-lancement-de-lapplication)
* [5. Compiler une version release](#5-compiler-une-version-release)

# 1. Installation de Git

Git permet de garder un historique de modification du code et de synchroniser les fichiers entre plusieurs machines. Tu trouveras un tutoriel pour te familiariser avec les bases [ici](LINKS.md).

Ouvre un terminal et entre la commande suivante pour l'installer :
```shell script
sudo apt install git
```

# 2. Installation de React Native

Vas sur le [site officiel](https://reactnative.dev/docs/environment-setup) puis sur l'onglet `React Native CLI Quickstart`, et sélectionne ensuite ta plateforme de développement et celle de ta cible.

Par exemple, si tu as un PC sous linux et un téléphone Android, sélectionne donc Linux et Android. 

⚠️ **Ne choisis pas `Expo CLI Quickstart`, suis bien les instructions pour `React Native CLI Quickstart`**

Suis ensuite les instructions pour bien installer React Native sur ta machine. **Va bien jusqu'à la fin**. Tu devrais pouvoir créer une application vide qui se lance sur ton téléphone/émulateur.

# 3. Installation de l'application

Si tu as bien suivi les instructions plus haut, tu devrais pouvoir lancer une application vide sur un appareil. Si ce n'est pas le cas, recommence l'installation depuis le début. Si malgré tout tu n'y arrives pas, envoie-moi un petit mail : [app@amicale-insat.fr](mailto:app@amicale-insat.fr).

## 3.1 Téléchargement du dépôt

⚠️ **La suite n'est valide que si tu veux compiler une version sans contribuer** (pour avoir les toutes dernières modifications par exemple).

Si tu veux contribuer des modifications, rends-toi sur [ce guide](CONTRIBUTE.md) pour comprendre comment créer un **fork**. 

Clone ce dépôt à l'aide de la commande suivante :
````shell script
git clone git@github.com:ClubInfoInsaT/application-amicale.git
````

Toute modification doit être réalisée sur une branche dédiée (pas de commit direct sur master). Cette nouvelle branche est ensuite fusionnée avec master une fois qu'elle est testée et vérifiée.
Ainsi, en prenant la branche master a n'importe quel moment, il devrait être possible de compiler une version stable.

Plus d'informations sur l'organisation avec git [ici](WORKFLOW.md).

## 3.2 Installation des dépendances

Une fois le dépôt sur ta machine et git sur la branche de ton choix, ouvre un terminal dans le dossier racine et installe les dépendances avec la commande suivante : 
````shell script
npm ci
````
Le paramètre `ci` indique à `npm` d'installer précisément comme dans le `package-lock.json` (que
l'on ne modifie pas manuellement). Pour plus d'info se référer à [cette
réponse](https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore#48524475).

Si cette command donne une erreur indiquant que la version d'une dépendance n'est pas valide, utilise cette commande à la place:
````shell script
npm ci --legacy-peer-deps
````

Si tu es sur macOS, tu devras aussi lancer la commande suivante pour installer les dépendances propres à iOS :
````shell script
cd ios && pod install
````

En cas de problème d'installation (notamment lors du changement de branche), supprime le dossier `node_modules` et relance les commandes précédentes.

# 4. Lancement de l'application

Suis les instructions sur le [site officiel](https://reactnative.dev/docs/environment-setup) pour lancer l'application. Il n'y a aucune différence avec une application classique.

Si tu utilises Webstorm, le projet contient des configurations de lancement pour lancer le projet d'un seul clic.

# 5. Compiler une version release

Merci de me contacter par mail pour toute information sur les release : [app@amicale-insat.fr](mailto:app@amicale-insat.fr)

