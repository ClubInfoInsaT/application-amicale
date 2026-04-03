# Mise à jour de React Native

Mettre à jour `react-native` peut être fastidieux.

Il est possible d'utiliser un _agent skill_ avec un outil tel que Mistral Vibe.

## Utilisation de l'agent /upgrade-react-native

1. **Installation** : L'agent est déjà installé dans le projet (voir `.agents/skills/upgrade-react-native/`)
2. **Exécution** : Utilise la commande `/upgrade-react-native <version>` où `<version>` est la version cible de React Native
3. **Processus automatique** : L'agent va :
   - Détecter la version actuelle
   - Récupérer les différences entre les versions
   - Appliquer les changements aux fichiers natifs (Android/iOS)
   - Mettre à jour les dépendances
   - Identifier les conflits éventuels

## Exemple

```
/upgrade-react-native 0.85.0
```

## Après la mise à jour

Après l'exécution de l'agent, il faudra :

- Exécuter `npm install`
- Exécuter `cd ios && pod install` (iOS uniquement)
- Tester l'application sur les deux plateformes
- Vérifier les éventuels avertissements ou erreurs

## Documentation complète

Consulte [NOTES.md](NOTES.md#2026-02-28--react-native-084-upgrade) pour plus de détails sur l'utilisation de cet agent et l'expérience de mise à jour vers React Native 0.84.
