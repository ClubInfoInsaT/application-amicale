# Contribuer

Tu veux contribuer au projet ? Mais c'est magnifique ! Ce guide va te montrer comment faire pour contribuer tes modifications.

Si tu as des problèmes ou des questions, n'hésite pas à me contacter par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)).


## ⚠️ Avant de commencer, merci de te familiariser avec [les bases !](LINKS.md)

# Table des matières

* [1. Prérequis](#1-prérequis)
* [2. Fork du projet](#2-fork-du-projet)
* [3. Fork du projet](#3-fork-du-projet)
* [4. Création d'une nouvelle branche](#4-création-dune-nouvelle-branche)
* [5. Réalisation d'une modification](#5-réalisation-dune-modification)
* [6. Création d'une Pull Request](#6-création-dune-pull-request)

# 1. Prérequis

Avant toute chose, tu dois installer React Native et git sur ta machine. Pour cela, suis [ce guide](INSTALL.md) jusqu'à l'étape 3.

# 2. Quoi faire ?

Tu trouveras une liste de choses à faire sur la [feuille de route](https://github.com/ClubInfoInsaT/application-amicale/projects/1). Tu peux aussi venir discuter et proposer des modifications sur [Discord](https://discord.gg/W8MeTec).

# 3. Fork du projet

Si tu as bien suivi les instructions plus haut, tu devrais pouvoir lancer une application vide sur un appareil. Si ce n'est pas le cas, recommence l'installation depuis le début. Si malgré tout tu n'y arrives pas, envoie-moi un petit mail : [app@amicale-insat.fr](mailto:app@amicale-insat.fr).

Il est maintenant temps de **Fork** le projet. Le dépôt officiel est protégé pour éviter le vandalisme. Un fork permet de copier le code du dépôt officiel et de le lier à ton compte. Sur cette nouvelle version, tu pourras faire les modifications que tu veux, et ensuite demander de fusionner ces modifications avec le dépôt officiel (faire une Pull Request). Le mainteneur actuel du projet vérifiera alors tes modifications et décidera ou non de les accepter.

Plus d'infos sur git [ici](LINKS.md).

Créer un fork est très simple. Pour cela, suis ces instructions :
 
 * Connecte-toi sur GitHub (en haut à droite) avec ton compte.
 * Vas sur le [dépôt officiel](https://github.com/ClubInfoInsaT/application-amicale) et clique sur 'Fork' en haut à droite.
 * Tu arrives ainsi sur la page du dépôt ! Il est exactement comme le dépôt officiel, à quelques détails près. Si tu regardes en haut à gauche, à la place de `ClubInfoInsaT/application-amicale`, il y a maintenant ton nom ! Tu as donc fait une copie du dépôt officiel que tu as mis sur ton compte.
 * Tu peux maintenant télécharger ce dépôt sur ta machine en utilisant la commande:
 ````shell script
git clone [LINK]
````
en remplaçant `[LINK]` par le lien que tu peux copier en haut à droite, au-dessus de la liste des fichiers (Gros bouton vert avec marqué Code).
* Tu as réussi à faire un Fork, bravo !

# 4. Création d'une nouvelle branche

Comme indiqué sur [ce guide](WORKFLOW.md), chaque fonctionnalité doit être développée dans sa propre branche puis fusionnée avec le master du dépôt officiel.

Pour créer une nouvelle branche, utilise la commande suivante :
````shell script
git checkout -b <branch-name>
````
En remplaçant `<branch-name>` par le nom souhaité (sans espaces !). Ce nom doit décrire rapidement ce que tu veux faire grâce à tes modifications.

Tu es maintenant sur ta nouvelle branche et prêt à faire tes modifications.

# 5. Réalisation d'une modification

Tu peux maintenant modifier ce que tu veux pour corriger un bug ou ajoute une fonctionnalité.

Mais avant de faire quoi que ce soit, merci de te signaler ! Cela évitera que plusieurs personnes corrigent le même bug ou de commencer à développer une fonctionnalité non voulue.

Pour installer l'appli sur ton téléphone/émulateur, reviens sur le [guide d'installation](INSTALL.md), et reprends à la section 3.2.

Avant de passer à l'étape suivante, merci de bien vérifier et tester tes modifications.

# 6. Création d'une Pull Request

Cette étape te permet d'envoyer tes modifications sur le dépôt officiel, pour être intégrées à l'application disponible dans en téléchargement.

Tout se fait simplement sur le site en suivant ces instructions :

* Connecte-toi sur GitHub.
* Vas sur le [dépôt officiel](https://github.com/ClubInfoInsaT/application-amicale) et clique sur l'onglet 'Pull Requests'.
* Cette page t'affiche la liste de toutes les pull requests. Pour en créer une nouvelle, clique sur le bouton 'New Pull  Request' en haut à droite.
* Tu arrives maintenant sur la page de création. Choisis master comme branche de destination, et ta branche créée précédemment comme source.
* Tu devrais voir en bas la liste de toutes tes modifications. Écris alors un titre présentant tes modifications (très court), et une description expliquant pourquoi elles sont nécessaires. Cela permettra d'expliquer au mainteneur pourquoi il devrait accepter tes modifications.
* Quand tout est bon, clique sur 'Create Pull Request' pour l'envoyer en attente de validation.
* Tu entreras ensuite en dialogue avec le mainteneur ! Il t'expliquera si certaines choses sont à modifier avant de fusionner dans master.

Et voilà tu as fait ta première pull request !

Si tu as des problèmes ou des questions, n'hésite pas à me contacter par mail ([app@amicale-insat.fr](mailto:app@amicale-insat.fr)).
