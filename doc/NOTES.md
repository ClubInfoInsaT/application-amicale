# Notes de développement

Ce fichier permet de regrouper les différentes informations sur des décisions actuelles, comme des changements de version ou des choix de technologie, tout cela dans le but de ne pas répéter les mêmes erreurs.

Ces notes pouvant évoluer dans le temps, leur date d'écriture est aussi indiquée.

## _2020-09-24_ | Flow

Flow est un système d'annotation permettant de rendre JavaScript typé statique. Développée par Facebook, cette technologie à initialement été adoptée. En revanche, de nombreux problèmes sont apparus :
* Système très complexe donnant de nombreuses erreurs inconnues, rendant la contribution complexe pour les non-initiés
* Manque de compatibilité avec les librairies existantes (la majorité utilisant TypeScript)
* Utilisation excessive du système lors du développement
* Plantage régulier du service Flow, nécessitant un redémarrage manuel

Ainsi, il a été décidé de migrer le projet vers Typescript.

## _2020-06-23_ | Expo

Expo est une surcouche à react native permettant de simplifier le processus de build. Le projet à commencé en l'utilisant, mais de nombreux problèmes ont été rencontrés :
* Augmentation importante de la taille de l'application
* Augmentation importante du temps de démarrage
* Impossibilité d'utiliser certaines librairies
* Obligation d'utiliser une version de react-native spécifique
* Impossibilité d'utiliser le moteur Hermes sur Android

Pour ces raisons, il a été décidé de l'abandonner pour passer à un développement en react-native pur. 

[Site officiel](https://docs.expo.io/)

## _2020-06-23_ | react-native-mapbox-gl

Librairie utilisée pour afficher une carte en utilisant OSM. N'a pas été utilisée car augmente la taille de l'apk de quelques Mo et rend la compilation plus difficile (il est nécessaire d'augmenter la taille du java heap dans gradle.properties).

[Dépot](https://github.com/react-native-mapbox-gl/maps)

## _2020-06-23_ | react-native-screens

Cette librairie permet d'améliorer les performances de la navigation en utilisant les optimisations natives.
En revanche, activer le support pour screens fait crash l'appli sur android 9+ lors de la navigation pour sortir d'un écran avec une webview.

[Dépot](https://github.com/software-mansion/react-native-screens) | [Référence](https://reactnavigation.org/docs/react-native-screens/)
