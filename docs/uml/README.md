# Documentation UML - Stage Keystone

Ce dossier contient les diagrammes UML générés à partir du code réel du projet Spring Boot + Angular + MySQL.

## 1. Vue d’ensemble

Le backend est une application Java 17 avec Spring Boot 4, JPA/Hibernate, Spring Security et JWT. Le frontend est une application Angular 17 qui consomme les APIs REST du backend et applique des gardes d’accès selon les rôles.

Les fonctionnalités réellement détectées dans le code sont :
- authentification et autorisation JWT
- gestion des utilisateurs
- gestion des clients
- gestion des responsables
- gestion des activités
- gestion des actifs
- classification des niveaux de sécurité
- assistant IA via Spring AI et OpenRouter

## 2. Acteurs détectés

- Administrateur : rôle `ADMIN`
- Consultant : rôle `CONSULTANT`
- Client : rôle `CLIENT`
- Utilisateur non authentifié : accès au formulaire de connexion

## 3. Diagrammes disponibles

### Diagramme de classes
- `01-diagramme-classes.puml` : vue de l’architecture métier, des relations JPA et des classes de sécurité/IA.

### Diagramme de cas d’utilisation
- `02-diagramme-cas-utilisation.puml` : principales fonctionnalités utilisateur et accessibilité par rôle.

### Diagrammes de séquence
- `03-sequence-authentification.puml` : flux complet de connexion avec JWT.
- `04-sequence-gestion-client.puml` : création, lecture, mise à jour et suppression d’un client.
- `05-sequence-gestion-activite.puml` : gestion d’une activité associée à un responsable.
- `06-sequence-gestion-actif.puml` : gestion d’un actif avec niveau de classification, parent/enfants et validation métier.
- `07-sequence-analyse-risque-ia.puml` : interaction entre le front, le contrôleur IA et le modèle OpenRouter via Spring AI.

### Diagrammes d’activité
- `08-activite-authentification.puml` : flux de validation des identifiants et génération du token.
- `09-activite-gestion-client.puml` : workflow de création/validation d’un client.
- `10-activite-analyse-risque.puml` : fondement du diagnostic GRC alimenté par l’assistant IA.

## 4. Principales classes métier

- `Client` : client GRC, détenteur de responsables et éventuellement d’un compte utilisateur.
- `Responsable` : personne responsable d’une activité pour un client.
- `Activite` : activité métier rattachée à un responsable.
- `Actif` : bien/ressource évaluée selon des niveaux de disponibilité/intégrité/confidentialité/tracabilité.
- `NiveauClassification` : référentiel de niveaux 1 à 4.
- `User` : compte utilisateur avec rôle et accès client/consultant.
- `Role` : enum `ADMIN`, `CONSULTANT`, `CLIENT`.

## 5. Choix de modélisation

- Les relations de cardinalité sont déduites des annotations JPA réelles.
- Les classes techniques sont limitées à la sécurité et au module d’IA, afin de garder le diagramme lisible.
- Les fonctionnalités non présentes dans le code ne sont pas intégrées, par exemple la génération de rapports PDF ou la gestion de risques séparée de l’outil IA.

## 6. Ouvrir les fichiers PlantUML

### Installation de PlantUML

Option 1 : installation via package manager
- macOS : `brew install plantuml`
- Ubuntu/Debian : `sudo apt install plantuml`
- Windows : installer PlantUML via Chocolatey ou télécharger la distribution officielle.

Option 2 : VS Code extension
- Installer l’extension `PlantUML` dans VS Code.
- Ouvrir un fichier `.puml` et utiliser le preview intégré.

### Génération PNG/SVG

```bash
plantuml docs/uml/*.puml
```

ou pour un fichier précis :

```bash
plantuml docs/uml/01-diagramme-classes.puml
```

## 7. Vérification

Les diagrammes ont été conçus en cohérence avec les contrôleurs, services, repositories, entités et configuration Spring Security du projet réel. Aucun diagramme n’invente de classe ou de fonctionnalité non présente dans le code.
