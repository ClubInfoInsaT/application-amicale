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
 
Ce dépôt contient la source de cette application, sous licence GPLv3.

## Contribuer

Vous voulez influencer le développement ? C'est très simple !

Pas besoin de connaissance, il est possible d'aider simplement en proposant des améliorations ou en rapportant des bugs par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)) ou sur [cette page](https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues), en vous connectant avec vos login INSA.

Si vous avez assez de connaissances et vous souhaitez proposer des modifications dans le code, [installez l'application](INSTALL.md) sur votre machine, réalisez votre modification et créez une 'pull request'. Si vous avez des problèmes ou des questions, n'hésitez pas à me contacter par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)).

## Technologies Utilisées
Cette application est faite en JavaScript avec React Native (framework Open Source créé par Facebook).

React Native permet de n'avoir qu'un seul code JavaScript à écrire pour Android et iOS. Pour compiler pour la plateforme souhaitée, il suffit d'effectuer une simple commande. Plus besoin de Mac pour développer une application iOS ! (Mais toujours besoin d'un pour compiler et publier sur l'App store...)

Cette application utilisait initialement Expo, permettant de simplifier grandement le développement et le déploiement, mais il a été abandonné à cause de ses limitations et de son impact sur les performances. Revenir sur Expo n'est pas possible sans un gros travail et une suppression de fonctionnalités non compatibles.

## [Installer l'application depuis ce dépot](INSTALL.md)

## [Notes sur l'état actuel du projet](NOTES.md)

## Liens utiles
* [Documentation React Native](https://reactnative.dev/docs/getting-started) (La techno de base)
* [Documentation React Native Paper](https://callstack.github.io/react-native-paper/) (Le framework d'UI)
* [Documentation React navigation](https://reactnavigation.org/docs/getting-started) (Le framework de navigation entre écrans)
* [Documentation Jest](https://jestjs.io/docs/en/getting-started) (Tests unitaires JavaScript)
* [Documentation Flow](https://flow.org/en/docs/react/) (Utilitaire de typage statique pour JavaScript)
