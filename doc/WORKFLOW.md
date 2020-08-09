# Organisation du travail

⚠️ **Ce projet dépend entièrement sur Git. Si tu n'es pas familier à cette technologie, rends-toi sur [cette page](LINKS.md) avant de lire la suite.**

La méthode ci-dessous est très fortement recommandée, car son efficacité a été testée et prouvée par de nombreux projets Open Source.

Ce qui suit a été inspiré des [règles de KDE](https://community.kde.org/Frameworks/Git_Workflow) et largement simplifié.

# Principes de base

## La branche Master est toujours prête
 
Cette branche est le centre du projet. Elle ne doit contenir que des fonctionnalités et améliorations achevées. **Elle doit être prête pour une release à tout moment**. Le code doit donc être testé et validé.

## Le développement à lieu dans les branches de 'fonctionnalités'

Pour des corrections de bugs ou l'implémentation de nouvelles fonctionnalités qui demandent du travail, il est nécessaire de créer une nouvelle branche depuis master. Le développeur peut manipuler cette branche comme il le souhaite, mais elle doit être testée et vérifiée avant d'être fusionnée avec master.

## Mainteneurs vs contributeur externe

Les **contributeurs externes** sont des volontaires qui veulent aider ponctuellement pour corriger des bugs/ajouter des fonctionnalités. Ils doivent suivre [la procédure pour créer un fork du projet](CONTRIBUTE.md) et faire une pull request pour intégrer leurs changements.

Les **mainteneurs** sont les personnes de confiance ayant un accès en écriture sur le dépôt officiel. C'est eux qui vérifient et acceptent les pull requests. Ils peuvent push et merge directement sur le dépôt officiel pour simplifier le développement.

#### Tu veux devenir contributeur ? Fais un tour [par ici](CONTRIBUTE.md) pour comprendre comment faire.

#### Tu es motivé et tu veux devenir mainteneur ? Contacte-moi par mail [app@amicale-insat.fr](mailto:app@amicale-insat.fr).
