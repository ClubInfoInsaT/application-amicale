![](https://etud.insa-toulouse.fr/~amicale_app/images/promo/Banner.png)
[<img src="https://etud.insa-toulouse.fr/~amicale_app/images/promo/app-store-badge.png" alt="app-store" width="150"/>](https://apps.apple.com/us/app/id1477722148)
[<img src="https://etud.insa-toulouse.fr/~amicale_app/images/promo/google-play-badge.png" alt="google-play" width="150"/>](https://play.google.com/store/apps/details?id=fr.amicaleinsat.application)

Projet démarré pendant l'été 2019 par Arnaud Vergnet (alors en 3MIC), cette application compatible Android et iOS permet aux étudiants d'avoir un accès facile aux informations du campus :
 - News de l'Amicale
 - Connexion à son compte Amicale
 - État des machines à laver
 - Liste des événements sur le campus
 - Stock du Proximo
 - Emploi du temps
 - Menu du RU
 - Disponibilité des salles libre accès
 - Réservation des Bib'Box

...et bien d'autres services

L'application est **Open Source** sous licence **GPLv3**.

Pour la source du serveur utilisé pour synchroniser les informations, merci de voir [ce dépôt](https://git.etud.insa-toulouse.fr/vergnet/application-amicale-serveur).

## 🚀 Contribuer

**Tu veux influencer le développement ? C'est très simple !**

#### 🙃 Aucune connaissance ?
Pas de problème ! Tu peux aider simplement en proposant des améliorations ou en rapportant des bugs par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)), ou sur [cette page](https://git.etud.insa-toulouse.fr/vergnet/application-amicale/issues) en te connectant avec tes login INSA.

#### 🤓 Développeur dans l'âme ?
Toutes les propositions de modification sont les bienvenues ! (enfin presque)

Pour cela, tu peux créer un fork de ce dépôt (en haut à droite), [installer l'application](INSTALL.md) sur ta machine, réaliser ta modification et créer une _pull request_. Si tu as des problèmes ou des questions, n'hésite pas à me contacter par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)).

#### 🤯 Motivé mais perdu ?
Tu es quand même le bienvenu ! Tu trouveras à [la fin de ce fichier ⤵️](#🔗-liens-utiles) une liste de liens pour t'aider à comprendre les technologies utilisées dans ce projet. Si tu as plus de questions, tu peux toujours me contacter par mail  ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)). 

## 👨‍💻 Technologies Utilisées
Cette application est faite en JavaScript avec React Native (framework Open Source créé par Facebook).

React Native permet de n'avoir qu'un seul code JavaScript à écrire pour Android et iOS. Pour compiler pour la plateforme souhaitée, il suffit d'effectuer une simple commande. Plus besoin de Mac pour développer une application iOS ! (Mais toujours besoin d'un pour compiler et publier sur l'App store...)

Tu trouveras une liste de liens utiles à [la fin de ce fichier ⤵️](#🔗-liens-utiles) pour retrouver toutes les infos !

## 💾 [Installer l'application depuis ce dépot](INSTALL.md)

## 📔️ [Notes de changement](Changelog.md)

## 🗒️ [Notes sur l'état actuel du projet](NOTES.md)

## 🔗 Liens utiles

Voici une liste de liens qui pourraient t'être utile, que ce soit pour contribuer ou tout simplement pour comprendre comment l'application fonctionne sous le capot.

#### Les bases

Le strict minimum pour pouvoir comprendre le code de l'application.  Il n'est pas nécessaire d'avoir de grandes connaissances en JavaScript, Flow ou Git pour lire le code, mais une compréhension du fonctionnement et de la syntaxe de React Native est nécessaire pour faire quoi que ce soit.

* [Tutoriel JavaScript](https://www.w3schools.com/js) : Un minimum de connaissances en JavaScript (ECMAScript 6) est nécessaire pour pouvoir comprendre le code
* [Documentation React Native](https://reactnative.dev/docs/getting-started) : La techno de base, qui utilise JavaScript
* [Tutoriel Git](https://www.tutorialspoint.com/git/index.htm) : Le système utilisé pour synchroniser le code entre plusieurs ordinateurs  
* [Documentation Flow](https://flow.org/en/docs/react/) : Un utilitaire pour rendre JavaScript typé statique (c'est-à-dire plus robuste pour de gros projets)

#### Comprendre les librairies

Si tu as compris les bases et que tu veux te plonger un peu plus en profondeur dans le code, tu peux utiliser les liens ci-dessous pour accéder aux frameworks les plus importants.

* [Documentation React Native Paper](https://callstack.github.io/react-native-paper/) : Le framework utilisé pour créer l'interface utilisateur (UI)
* [Documentation React Navigation](https://reactnavigation.org/docs/getting-started) : Le framework utilisé pour faciliter la navigation classique entre différents écrans

#### Les Plus

Si t'es vraiment à fond dans le projet et que tu veux faire des trucs trop ouf, tu peux lire ça. Même moi j'ai eu la flemme de tout lire. 

* [Documentation Jest](https://jestjs.io/docs/en/getting-started) : Framework de tests unitaires pour JavaScript

#### Les Logiciels

Tu ne sais pas trop quel logiciel utiliser ? C'est normal y'a beaucoup de choix, mais tu trouveras ici une liste très réduite de logiciels qui marchent bien pour le développement.

* [Webstorm](https://www.jetbrains.com/webstorm/buy/#discounts?billing=yearly) : Un logiciel pas mal que j'utilise et gratuit pour les étudiants/projets open-source
* [VSCodium](https://vscodium.com/) : Un logiciel plus simple/léger que Webstorm mais avec un peu moins de fonctionnalités.


# Copyright
Apple and Apple Logo are trademarks of Apple Inc.

Google Play et le logo Google Play sont des marques de Google LLC.
