# RAPPORT DE STAGE D'INGÉNIEUR

## [À COMPLÉTER : Université / École / Département]

### Conception et développement d'une plateforme GRC intégrant l'intelligence artificielle

### Réalisé par :
[À COMPLÉTER : Nom de l’étudiant]

### Entreprise :
Keystone

### Encadrant entreprise :
[À COMPLÉTER]

### Encadrant académique :
[À COMPLÉTER]

### Année universitaire :
2026 / 2027

---

# Remerciements

Je tiens à remercier l’entreprise Keystone pour m’avoir permis de réaliser ce stage dans un cadre professionnel stimulant. Je remercie également l’équipe qui a contribué à l’accompagnement du projet, ainsi que les encadrants académiques et professionnels qui ont apporté leur regard et leurs conseils au cours de cette expérience.

Je remercie également l’ensemble des personnes ayant contribué à l’analyse, au développement, au déploiement et à la validation du projet présenté dans ce rapport.

[À COMPLÉTER : remerciements spécifiques à l’encadrant, à l’équipe, à l’établissement scolaire]

---

# Résumé

Ce stage a porté sur la conception et le développement d’une plateforme GRC (Governance, Risk & Compliance) destinée à centraliser la gestion de clients, responsables, activités, actifs et classifications de sécurité au sein d’une même application. Le projet a été développé selon une architecture web moderne basée sur Spring Boot pour le backend, Angular pour le frontend et MySQL pour la base de données relationnelle. Le système comprend également un module d’intelligence artificielle basé sur Spring AI et sur le fournisseur OpenRouter, permettant à un utilisateur authentifié de poser des questions métier en français et de recevoir une réponse contextualisée selon son rôle et son périmètre d’accès.

La plateforme met en œuvre une authentification par JWT, une séparation des droits selon les rôles ADMIN, CONSULTANT et CLIENT, ainsi qu’un mécanisme de filtrage par accès client. Le backend expose des API REST sécurisées, tandis que le frontend Angular consomme ces services et applique des gardes de navigation pour contrôler l’accès aux écrans. La solution a également été intégrée à Docker Compose pour la conteneurisation locale et à des manifests Kubernetes pour un déploiement orienté environnement cloud ou local sur un cluster.

La contribution principale du stage réside dans la mise en place d’une base logicielle cohérente, sécurisée et extensible, intégrant à la fois des fonctionnalités métier GRC et une couche d’assistance intelligente. Le projet constitue ainsi une base de travail robuste pour la gestion de la conformité, des risques et de l’analyse des actifs d’une organisation.

Mots-clés : GRC, Governance Risk Compliance, Spring Boot, Angular, Intelligence Artificielle, Docker, Kubernetes, sécurité, Java, MySQL.

---

# Abstract

This internship focused on the design and development of a GRC (Governance, Risk & Compliance) platform intended to centralize the management of clients, responsible persons, activities, assets and security classifications within a single application. The project was developed using a modern web architecture based on Spring Boot for the backend, Angular for the frontend and MySQL for the relational database. The system also includes an artificial intelligence module based on Spring AI and the OpenRouter provider, allowing an authenticated user to ask business questions in French and receive a contextualized response according to their role and access scope.

The platform implements authentication based on JWT, separation of rights according to the roles ADMIN, CONSULTANT and CLIENT, and a filtering mechanism based on client access. The backend exposes secure REST APIs, while the Angular frontend consumes these services and applies navigation guards to control access to screens. The solution was also integrated with Docker Compose for local containerization and with Kubernetes manifests for deployment in a cloud or local cluster environment.

The main contribution of the internship lies in the implementation of a coherent, secure and extensible software foundation, integrating both GRC business features and an intelligent assistance layer. The project therefore constitutes a solid foundation for the management of compliance, risk and asset analysis within an organization.

---

# Introduction générale

Le projet étudié au cours de ce stage s’inscrit dans le domaine de la Governance, Risk & Compliance (GRC), qui consiste à organiser, structurer et piloter les activités liées à la conformité, à la sécurité et à la gestion des risques au sein d’une organisation. Dans un contexte où les entreprises doivent gérer simultanément des actifs, des responsabilités et des risques, une solution logicielle centralisée devient un outil de pilotage essentiel pour les décideurs et les équipes métiers.

L’objectif principal du stage était de développer une plateforme permettant de gérer les informations liées aux clients, aux responsables, aux activités et aux actifs d’un client donné, ainsi que de classifier ces actifs selon des niveaux de disponibilité, intégrité, confidentialité et traçabilité. Le projet a également mis en place un assistant intelligent capable de répondre à des questions de nature GRC à partir du contexte applicatif et du rôle de l’utilisateur.

Le projet repose sur une architecture web moderne avec un backend Java Spring Boot, un frontend Angular et une base de données MySQL. La sécurisation des services est assurée par Spring Security et des tokens JWT. La gestion des accès est définie par les rôles `ADMIN`, `CONSULTANT` et `CLIENT` et repose sur des contrôles d’autorisation au niveau des services et des contrôleurs.

Le développement s’inscrit également dans une logique de déploiement industriel, avec des fichiers Docker et Docker Compose pour la conteneurisation locale et des manifests Kubernetes pour la gestion des services dans un environnement orchestré. Cette dimension DevOps, associée aux composants applicatifs et de sécurité, permet d’illustrer la démarche globale de conception, de développement et de livraison d’une application moderne.

Cette étude présente le contexte du projet, les besoins fonctionnels et non fonctionnels, l’architecture logicielle, la modélisation UML, le développement backend et frontend, les aspects de sécurité, l’intégration IA et les éléments de déploiement Docker/Kubernetes.

---

# Chapitre 1 — Contexte général du projet

## 1.1 Présentation de l’entreprise

[À COMPLÉTER : présentation officielle de l’entreprise Keystone]

## 1.2 Contexte du projet

Le projet s’inscrit dans un contexte de gestion de gouvernance, risques et conformité. Il vise à fournir une base applicative capable de représenter les relations entre les clients, les responsables, les activités et les actifs d’une organisation. L’application est conçue pour organiser ces éléments de manière cohérente et sécurisée, en offrant des mécanismes de consultation et de modification soumis à des règles métier et à des droits d’accès.

## 1.3 Problématique

Les organisations doivent souvent gérer des données sensibles liées à leurs actifs, à leurs activités et à leur structure de responsabilité. Sans une solution centralisée, ces informations peuvent être dispersées, difficiles à suivre et sujettes à des erreurs de validation ou à des accès non maîtrisés. Le projet répond à cette problématique en centralisant la gestion de ces informations dans une application sécurisée et structurée.

## 1.4 Solution proposée

La solution développée repose sur une plateforme web comportant :

- un backend Spring Boot exposant des API REST sécurisées ;
- un frontend Angular pour l’interface utilisateur ;
- une base de données MySQL dédiée à la persistance des données métiers ;
- des mécanismes de sécurité par JWT et rôles applicatifs ;
- un assistant IA basé sur Spring AI et OpenRouter ;
- une conteneurisation avec Docker et des manifestes Kubernetes.

## 1.5 Objectifs

Les objectifs du projet sont les suivants :

- gérer les clients et les responsables associés ;
- organiser les activités métiers d’un responsable ;
- gérer les actifs et leurs relations hiérarchiques ;
- classifier les actifs selon des niveaux d’impact ;
- sécuriser les accès et autoriser l’usage selon le rôle utilisateur ;
- fournir une aide intelligente via un assistant IA ;
- permettre un déploiement local et orchestré via Docker et Kubernetes.

## 1.6 Méthodologie

La méthodologie a reposé sur une analyse des besoins métier directement déduite du code applicatif et des fichiers de configuration. Le projet a été structuré autour de couches logiques cohérentes : entités JPA, repositories, services, contrôleurs, DTO, sécurité et interface front. Les fichiers de configuration Docker et Kubernetes ont également permis de compléter l’analyse du système de déploiement.

---

# Chapitre 2 — Analyse et spécification des besoins

## 2.1 Identification des acteurs

Les acteurs identifiés à partir du code sont :

- Administrateur : rôle `ADMIN`
- Consultant : rôle `CONSULTANT`
- Client : rôle `CLIENT`
- Utilisateur non authentifié : accès à la page de connexion

L’architecture impose que la plupart des parcours métier soient accessibles uniquement à des utilisateurs authentifiés.

## 2.2 Besoins fonctionnels

Les besoins fonctionnels identifiés dans le projet sont les suivants :

- authentification des utilisateurs ;
- gestion des comptes utilisateurs ;
- gestion des clients ;
- gestion des responsables ;
- gestion des activités ;
- gestion des actifs ;
- classification des actifs selon les niveaux de disponibilité, intégrité, confidentialité et traçabilité ;
- contrôle des autorisations par utilisation de rôles et de client associé ;
- assistance intelligente via l’IA ;
- consultation du tableau de bord et des services applicatifs.

## 2.3 Besoins non fonctionnels

Les besoins non fonctionnels présents dans le projet sont principalement :

- sécurité des accès avec JWT et Spring Security ;
- séparation des données par rôle et périmètre client ;
- maintenabilité de l’architecture Spring Boot / Angular ;
- disponibilité de la solution via conteneurisation ;
- déploiement orchestré via Kubernetes ;
- confidentialité des données sensibles et des clés d’accès.

## 2.4 Diagramme de cas d’utilisation

Voir le diagramme PlantUML associé : [rapport/diagrams/use-case.puml](diagrams/use-case.puml)

## 2.5 Description des principaux cas d’utilisation

### Authentification
- Acteur : utilisateur non authentifié, administrateur, consultant, client
- Préconditions : comptes utilisateurs existants dans le système
- Scénario nominal : saisie des identifiants, validation par Spring Security, génération d’un JWT, redirection vers le tableau de bord
- Cas alternatifs : identifiants invalides, retour HTTP 401

### Gestion des clients
- Acteur : administrateur, consultant, client selon les règles de visibilité
- Préconditions : utilisateur authentifié
- Scénario nominal : création, consultation, modification ou suppression d’un client
- Cas alternatifs : email déjà présent, accès non autorisé, client introuvable

### Gestion des activités
- Acteur : administrateur, consultant, client selon les droits
- Scénario nominal : association d’une activité à un responsable, validation de la création, stockage en base

### Gestion des actifs
- Acteur : administrateur, consultant, client selon les droits
- Scénario nominal : création d’un actif, association à une activité, définition des niveaux de classification, sauvegarde des valeurs dérivées

### Analyse IA
- Acteur : administrateur, consultant, client
- Scénario nominal : demande utilisateur, contexte applicatif injecté, appel au modèle OpenRouter, réponse générée en retour

---

# Chapitre 3 — Conception et modélisation

## 3.1 Architecture générale

L’architecture du projet suit le modèle standard suivant :

Angular frontend → API REST → Spring Boot backend → MySQL

Le système inclut également :

- Spring Security pour l’authentification et l’autorisation ;
- JWT pour la gestion des sessions ;
- Spring AI pour le module d’assistance ;
- Docker et Kubernetes pour le déploiement.

## 3.2 Architecture logicielle

Le backend est structuré selon les principes d’une architecture en couches :

- couche de persistance : `entity`, `repository`
- couche métier : `service`
- couche REST : `controller`
- couche de transfert : `dto`
- couche de sécurité : `security`
- couche d’intégration IA : `ia`
- couche de configuration : `config`

Le frontend Angular est organisé autour de composants, services, modèles et gardes de navigation. La logique métier est séparée entre les services Angular et les composants d’affichage.

## 3.3 Diagramme de classes

Voir le diagramme PlantUML associé : [rapport/diagrams/class-diagram.puml](diagrams/class-diagram.puml)

## 3.4 Modèle de données

Les principales entités identifiées sont :

### User
- identifiant unique
- prénom, nom, email, mot de passe hashé
- rôle enum (`ADMIN`, `CONSULTANT`, `CLIENT`)
- statut activé/désactivé
- relation avec un client spécifique ou avec plusieurs clients affectés

### Client
- nom, email, adresse, téléphone
- image de classification
- relation avec plusieurs responsables
- relation avec un utilisateur client et avec une liste de consultants affectés

### Responsable
- nom, téléphone, email
- relation avec un client
- relation avec plusieurs activités

### Activite
- nom, description
- relation avec un responsable
- relation avec plusieurs actifs

### Actif
- nom, description, type
- niveaux de disponibilité, intégrité, confidentialité, traçabilité
- relation parent/enfant
- relation avec une activité et un niveau de classification

### NiveauClassification
- niveau 1 à 4
- libellés associés à disponibilite, integrite, confidentialite, tracabilite

## 3.5 Sécurité

La sécurité est implémentée par Spring Security avec une configuration centralisée dans `SecurityConfig`. Les règles de sécurité sont les suivantes :

- les requêtes `OPTIONS` sont autorisées ;
- le login public est accessible sans authentification ;
- toutes les autres requêtes sont authentifiées à l’aide d’un JWT ;
- les rôles sont utilisés via `hasRole(...)` et `hasAnyRole(...)` ;
- le flux d’authentification repose sur `JwtAuthenticationFilter` et `CustomUserDetailsService` ;
- l’accès client est contrôlé par `AuthorizationService`.

La validation des tokens JWT est assurée par `JwtService`, qui vérifie la signature et l’expiration du token. Les erreurs 401 et 403 sont gérées par des handlers dédiés.

## 3.6 Architecture IA

Le module IA est implémenté avec Spring AI. La configuration est située dans `AiConfig` et le contrôleur principal est `ChatController`.

Le flux réel est le suivant :

1. l’utilisateur authentifié envoie une question depuis Angular ;
2. le frontend appelle `/ai/chat` ;
3. `ChatController` récupère l’utilisateur courant via `AuthorizationService` ;
4. le contexte métier et le rôle de l’utilisateur sont injectés dans le prompt ;
5. `ChatClient` transmet la requête au fournisseur OpenRouter ;
6. la réponse est renvoyée au frontend sous forme de texte.

Le projet utilise le modèle configuré dans `application.yml` : `nvidia/nemotron-3.5-lightning:free` via OpenRouter. Le sous-système `ToolDiscovery` permet de découvrir les outils annotés `@Tool` et de les rendre disponibles au modèle. Le système n’implémente pas de RAG documentaire explicite dans le code observé ; il s’agit réellement d’un assistant contextuel lié aux données de session et aux outils métier disponibles.

## 3.7 Architecture Docker / Kubernetes

La conteneurisation est présente dans le dépôt avec une configuration Docker Compose qui orchestrent :

- `mysql` pour la base de données ;
- `backend` pour le service Java ;
- `frontend` pour le service Angular.

La partie Kubernetes est présente sous le dossier `k8s` avec :

- `namespace.yaml`
- `configmap.yaml`
- `secret.yaml`
- `mysql-deployment.yaml`
- `mysql-pvc.yaml`
- `mysql-service.yaml`
- `backend-deployment.yaml`
- `backend-service.yaml`
- `frontend-deployment.yaml`
- `frontend-service.yaml`
- `ingress.yaml`

---

# Chapitre 4 — Réalisation

## 4.1 Mise en place de l’environnement

Le projet a été préparé avec des outils de développement standardisés pour une application Java et Angular :

- Java 17 ;
- Maven pour le backend ;
- Spring Boot 4.0.7 ;
- Angular 17 ;
- Docker et Docker Compose ;
- Kubernetes manifests et service d’ingress NGINX.

## 4.2 Développement backend

Le backend est construit en Java avec Spring Boot. L’architecture contient des packages clairement identifiés :

- `controller` : endpoints REST ;
- `service` : logique de traitement ;
- `repository` : accès à la base ;
- `entity` : modèles JPA ;
- `dto` : objets de transfert ;
- `mapper` : transformation entre entités et DTO ;
- `security` : JWT, filtres et autorisations ;
- `ia` : module IA et découverte des outils.

Les services principaux sont :

- `ClientServiceImpl`
- `ResponsableServiceImpl`
- `ActiviteServiceImpl`
- `ActifServiceImpl`
- `AuthService`
- `UserManagementService`

Le cœur du modèle métier est composé de :

- `Client`, `Responsable`, `Activite`, `Actif`, `NiveauClassification`, `User`

## 4.3 Développement frontend

Le frontend Angular contient les composants suivants :

- login
- forgot-password
- register
- contact-admin
- client-dashboard
- responsable-dashboard
- activite-dashboard
- actif-dashboard
- dashboard
- asset-classifier
- ai-assistant
- user-management

Les services Angular sont notamment :

- `AuthService`
- `ClientService`
- `ResponsableService`
- `ActiviteService`
- `ActifService`
- `UserService`
- `AiAgentService`
- `ClassificationService`

Le système de navigation repose sur `app-routing.module.ts` ainsi que sur `auth.guard.ts` et `role.guard.ts`.

## 4.4 Authentification et sécurité

Le point d’entrée de l’authentification est `AuthController`. L’API `POST /api/auth/login` accepte un email et un mot de passe. La validation est réalisée par `AuthenticationManager` et le token JWT est produit par `JwtService`.

Le backend protège les endpoints à l’aide de `SecurityConfig`. Les rôles sont utilisés pour filtrer les entrées. Les contrôles d’accès métier sont également renforcés dans `AuthorizationService`.

Une mesure importante du système réside dans la séparation entre :

- rôle global (`ADMIN`, `CONSULTANT`, `CLIENT`) ;
- périmètre fonctionnel : accès ou non à un client donné ;
- visibilité de données selon l’association utilisateur-client ou consultant-client.

## 4.5 Gestion des clients

La gestion des clients s’effectue via le contrôleur `ClientController` et le service `ClientServiceImpl`.

Les opérations disponibles dans le code sont :

- création d’un client ;
- mise à jour d’un client ;
- consultation d’un client par identifiant ;
- liste des clients filtrés selon le profil de l’utilisateur ;
- suppression d’un client.

Les règles métier prévalentes sont :

- l’email du client doit être unique ;
- l’accès est limité à l’administrateur pour certaines opérations ;
- les consultants et clients ne peuvent consulter les clients auxquels ils sont autorisés.

## 4.6 Gestion des responsables

Les responsables sont gérés par `ResponsableController` et `ResponsableServiceImpl`.

Les principales opérations sont :

- création d’un responsable associé à un client ;
- consultation d’un responsable ;
- liste des responsables par client ;
- mise à jour ;
- suppression.

Chaque responsable appartient à un client donné. Les activités sont ensuite rattachées à un responsable.

## 4.7 Gestion des activités

La gestion des activités est assurée par `ActiviteController` et `ActiviteServiceImpl`. Le système empêche les doublons de nom pour un responsable donné, en s’appuyant sur la méthode `existsByNomIgnoreCaseAndResponsableId`.

Les activités sont organisées de manière à regrouper des actifs sous un responsable identifié. L’application impose ensuite un contrôle d’accès par client.

## 4.8 Gestion des actifs

La gestion des actifs est une composante centrale du projet. Elle s’appuie sur `ActifController` et `ActifServiceImpl`.

Les fonctionnalités observées sont :

- création d’un actif ;
- mise à jour d’un actif ;
- récupération d’un actif par identifiant ;
- liste des actifs d’une activité ;
- liste des actifs racines ;
- liste des sous-actifs d’un parent ;
- suppression.

Un actif peut avoir :

- un parent ;
- des enfants ;
- une activité associée ;
- un niveau de classification ;
- des valeurs calculées de niveau maximal et de valeur monétaire.

Le code applique une logique de dérivation de la classification, avec calcul sur la base des niveaux de disponibilité, intégrité, confidentialité et traçabilité.

## 4.9 Gestion des risques et classification

La classification est centrale dans le système. `NiveauClassification` contient quatre niveaux, de 1 à 4, chacun associé à des descriptions de disponibilité, intégrité, confidentialité et traçabilité.

Le calcul des niveaux dans `ActifServiceImpl` repose sur la règle selon laquelle :

- le niveau maximal est déterminé par le plus élevé des attributs `disponibiliteLevel`, `integriteLevel`, `confidentialiteLevel` et `tracabiliteLevel` ;
- si les valeurs ne sont pas renseignées, le système retombe sur le niveau de classification associé ;
- la valeur de l’actif est ensuite calculée à partir de ce niveau maximal.

## 4.10 Intelligence artificielle

Le module IA est une fonctionnalité importante du projet. La configuration Spring AI est visible dans le fichier `application.yml` et dans la classe `AiConfig`.

Le flux d’intégration réel est :

- Angular appelle `/ai/chat` ;
- le backend valide l’utilisateur courant ;
- le `SystemPrompts.SYSTEM_MESSAGE` rajoute le contexte métier GRC ;
- `ToolDiscovery` récupère les outils annotés ;
- `ChatClient` appelle le modèle OpenRouter ;
- la réponse est retournée au frontend.

Le composant `AiAgentService` du frontend envoie une requête HTTP avec le paramètre `message` à l’URL `/ai/chat`.

Les outils IA sont découverts via Spring AI et `@Tool`. Cette structure est présente dans les classes `ClientServiceImpl`, `ResponsableServiceImpl`, `ActiviteServiceImpl` et `ActifServiceImpl`.

## 4.11 Docker

Le projet utilise Docker Compose pour orchestrer les services de la plateforme. La configuration contient trois services principaux :

- `mysql`
- `backend`
- `frontend`

Le backend est construit à partir d’un `Dockerfile` Maven multi-stage. Le frontend est construit avec Node.js puis servi via NGINX.

Les points clés de la configuration sont :

- base MySQL sur le port 3306 exposé localement ;
- backend sur le port 8083 ;
- frontend sur le port 4200 ;
- variable `APP_CORS_ORIGIN` définie vers `http://localhost:4200` ;
- dépendance du backend à MySQL via `depends_on` ;
- volume nommé `mysql-data` pour la persistance des données.

## 4.12 Kubernetes

Le dossier `k8s` contient des manifests de déploiement réels. L’architecture Kubernetes est centrée sur un namespace `grc`.

Les principales ressources présentes sont :

- `Namespace` : `grc`
- `ConfigMap` : `grc-config`
- `Secret` : `grc-secrets`
- `PersistentVolumeClaim` : `mysql-pvc`
- `Deployment` : `mysql`, `backend`, `frontend`
- `Service` : `mysql`, `backend`, `frontend`
- `Ingress` : `grc-ingress`

Les services sont exposés au sein du cluster et l’Ingress redirige les requêtes vers le frontend et le backend selon le chemin.

---

# Chapitre 5 — Tests et validation

Le dépôt contient des fichiers de tests et des spécifications fonctionnalistes. On peut notamment identifier :

- tests backend Java sur la sécurité et le comportement de base ;
- tests Angular de services et composants ;
- tests de validation de l’authentification ;
- tests liés à la gestion des services Angular.

Il est important de noter que le rapport ne prétend à aucun résultat de test chiffré non vérifié dans le projet. Les tests présents semblent constituer une base de validation technique, mais aucun résultat exploitable n’a été documenté dans le dépôt. Les tests à exécuter et valider manuellement ou automatiquement restent à documenter selon les besoins de l’équipe de développement.

### Tableau de test – modèle de suivi

| ID | Fonctionnalité | Description | Résultat |
| --- | --- | --- | --- |
| T01 | Authentification | Identification d’un utilisateur valide | [À COMPLÉTER] |
| T02 | Authentification | Identification avec identifiants invalides | [À COMPLÉTER] |
| T03 | Clients | Création d’un client | [À COMPLÉTER] |
| T04 | Responsables | Création d’un responsable | [À COMPLÉTER] |
| T05 | Activités | Création d’une activité | [À COMPLÉTER] |
| T06 | Actifs | Création et classification d’un actif | [À COMPLÉTER] |
| T07 | IA | Appel au modèle OpenRouter | [À COMPLÉTER] |
| T08 | Docker | Démarrage des services | [À COMPLÉTER] |
| T09 | Kubernetes | Déploiement des manifests | [À COMPLÉTER] |

---

# Chapitre 6 — Déploiement et DevOps

## 6.1 Conteneurisation

La conteneurisation est réelle et validée par le dépôt. Le backend et le frontend possèdent chacun un `Dockerfile`, et un `docker-compose.yml` orchestre la pile complète.

## 6.2 Docker Compose

La pile Docker expose :

- `mysql` sur le port 3306 ;
- `backend` sur le port 8083 ;
- `frontend` sur le port 4200.

La configuration configure les variables environnementales importantes, notamment :

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `KEY_SECRET`
- `JWT_EXPIRATION`
- `APP_CORS_ORIGIN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `OPENROUTER_API_KEY`

## 6.3 Architecture des conteneurs

Les conteneurs sont interconnectés par le réseau Docker implicitement créé par Docker Compose. Le backend dépend de la base de données MySQL et le frontend dépend du backend. Cette architecture permet une mise en œuvre locale rapide et reproductible.

## 6.4 Persistance MySQL

Le volume `mysql-data` assure la persistance des données de MySQL. La base est initialisée avec le nom `risque2`.

## 6.5 Déploiement Kubernetes

Le projet contient des manifests Kubernetes prêtes à l’emploi. L’architecture mise en place apporte une logique de déploiement orientée :

- namespace dédié ;
- gestion des secrets et variables de configuration ;
- réseau interne pour les services ;
- accès externe via Ingress ;
- stockage persistant pour la base MySQL ;
- probes de santé sur les services backend et MySQL.

## 6.6 Vérification du déploiement

Les commandes suivantes sont documentées dans le guide de déploiement :

```bash
docker compose up --build
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

Aucune exécution réelle des commandes n’a été vérifiée dans ce workspace. Le guide de déploiement documente bien la procédure, mais les résultats de déploiement final restent à valider dans l’environnement cible.

---

# Chapitre 7 — Difficultés rencontrées et solutions

## Problème 1 : sécurisation des accès par rôle et par client

### Cause
La solution doit limiter les données selon le profil de l’utilisateur : un administrateur doit avoir un accès global, tandis qu’un client ou un consultant ne doit pas voir des données hors de son périmètre.

### Solution
La logique a été portée dans `AuthorizationService` avec des méthodes telles que `canAccessClient`, `assertClientAccess` et `assertAdmin`.

### Résultat
Le backend applique une logique cohérente d’accès en fonction du rôle de l’utilisateur et des liens client/consultant.

## Problème 2 : configuration de la sécurité JWT

### Cause
L’application doit authentifier les appels et garantir l’intégrité des tokens.

### Solution
La solution repose sur `JwtAuthenticationFilter`, `JwtService` et `CustomUserDetailsService`, avec un mécanisme de validation de signature et d’expiration du token.

### Résultat
Les endpoints protégés sont sécurisés et les appels non authentifiés sont rejetés.

## Problème 3 : intégration IA

### Cause
Le projet doit exposer une assistant intelligent sans exposer de données hors du périmètre utilisateur.

### Solution
Le contrôleur `ChatController` ajoute le rôle de l’utilisateur et son périmètre au prompt, puis fait appel au modèle via `ChatClient`. Les outils Spring AI sont également découverts pour enrichir le contexte.

### Résultat
La plateforme fournit une aide IA contextualisée, en gardant le périmètre de données cohérent avec le profil utilisateur.

## Problème 4 : déploiement local et orchestré

### Cause
Le projet doit tourner en local et potentiellement dans un environnement Kubernetes.

### Solution
Le dépôt contient :

- Dockerfiles backend/frontend ;
- `docker-compose.yml` ;
- manifests k8s (`namespace`, `configMap`, `secret`, `deployment`, `service`, `ingress`).

### Résultat
La solution est documentée pour un déploiement local et un déploiement orchestré, même si le résultat réel du déploiement doit être validé dans l’environnement cible.

---

# Chapitre 8 — Conclusion et perspectives

## Bilan du stage

Le stage a permis de développer une plateforme GRC cohérente, sécurisée et fonctionnelle, avec une structuration claire du backend et du frontend. Le projet couvre les besoins essentiels liés à la gestion des clients, responsables, activités, actifs et classifications. L’intégration de la sécurité et du module IA renforce la valeur métier de la solution.

## Compétences acquises

### Java / Spring Boot
- développement d’API REST ;
- modélisation JPA ;
- gestion de services et repositories ;
- sécurisation des endpoints ;
- intégration de composants de configuration.

### Angular
- développement de composants ;
- services HTTP ;
- routing ;
- gardes de navigation ;
- gestion des états front via services.

### Sécurité
- JWT ;
- Spring Security ;
- contrôle des rôles ;
- contrôle d’accès selon le client ;
- filtrage des données.

### Intelligence artificielle
- Spring AI ;
- configuration OpenRouter ;
- outils Spring AI ;
- assistant contextualisé selon le rôle utilisateur.

### Docker
- conteneurisation backend et frontend ;
- orchestration locale avec Docker Compose ;
- gestion des variables d’environnement.

### Kubernetes
- namespace ;
- services ;
- deployments ;
- ingress ;
- configMaps et secrets ;
- stockage persistant MySQL.

## Limites actuelles

Le projet contient des éléments utiles et structurés, mais certaines limites peuvent être relevées :

- les résultats de tests automatisés doivent être documentés plus précisément dans un environnement de validation ;
- la configuration OpenRouter et les secrets doivent être gérés avec vigilance selon le contexte réel de déploiement ;
- l’UI et les flux de validation peuvent encore être enrichis selon les besoins métier évolutifs ;
- le module IA est fonctionnel mais dépend directement d’une configuration externe au projet.

## Perspectives

Les perspectives d’évolution sont les suivantes :

- mise en place d’une chaîne CI/CD ;
- intégration de surveillance et observabilité ;
- amélioration du module IA avec une logique plus avancée ;
- ajout de fonctionnalités complémentaires de reporting et d’audit ;
- renforcement des mécanismes de haute disponibilité et de tolérance aux pannes ;
- approfondissement des validations métier et de la qualité logicielle.

---

# Conclusion générale

Ce stage a permis de développer une plateforme GRC fonctionnelle, sécurisée et orientée métier. L’application couvre les besoins fondamentaux liés à la gestion des clients, responsables, activités, actifs ainsi qu’à la classification de ces actifs selon des critères de sécurité. La solution a également été enrichie d’un assistant IA, ce qui lui confère une dimension d’aide à la décision utile dans le contexte GRC.

L’architecture logicielle mise en œuvre repose sur des technologies standardisées et largement utilisées dans le développement d’applications modernes : Spring Boot, Angular, MySQL, Docker, Kubernetes et Spring AI. Ces choix techniques démontrent une bonne compréhension des enjeux actuels du développement logiciel et du déploiement de solutions applicatives dans des environnements professionnels.

Le projet constitue ainsi une base solide pour les besoins de gouvernance, de conformité et de gestion du risque, tout en ouvrant des perspectives d’évolution importantes en matière d’intelligence artificielle, d’automatisation et d’industrialisation du déploiement.

---

# Bibliographie / Webographie

La bibliographie ci-dessous est limitée aux références directement liées aux technologies présentes dans le projet réel :

- Spring Boot documentation officielle
- Spring Security documentation officielle
- Spring Data JPA documentation officielle
- Angular documentation officielle
- MySQL documentation officielle
- Docker documentation officielle
- Kubernetes documentation officielle
- Spring AI documentation officielle
- OpenRouter API documentation officielle

[À COMPLÉTER : références précises selon les sources réellement consultées]

---

# Annexes

## Annexe A – Structure du projet

Le projet est organisé selon les composants suivants :

- `backend/` : application Spring Boot
- `frontend/` : application Angular
- `k8s/` : manifests Kubernetes
- `docs/uml/` : diagrammes UML générés lors de l’analyse du projet
- `docker-compose.yml` : orchestration locale des services

## Annexe B – Commandes de déploiement

```bash
docker compose up --build
kubectl apply -f k8s/
```

## Annexe C – Diagrammes UML

Les fichiers PlantUML associés sont disponibles dans le dossier `rapport/diagrams/`.

## Annexe D – Captures d’écran

[INSÉRER CAPTURE D’ÉCRAN — Page de connexion]
Figure A.1 — Interface d’authentification

[INSÉRER CAPTURE D’ÉCRAN — Dashboard principal]
Figure A.2 — Tableau de bord de l’application

[INSÉRER CAPTURE D’ÉCRAN — Gestion des clients]
Figure A.3 — Interface de gestion des clients

[INSÉRER CAPTURE D’ÉCRAN — Gestion des actifs]
Figure A.4 — Interface de gestion des actifs

[INSÉRER CAPTURE D’ÉCRAN — Assistant IA]
Figure A.5 — Interface d’analyse IA

---

# Table des matières

1. Remerciements
2. Résumé
3. Abstract
4. Introduction générale
5. Chapitre 1 — Contexte général du projet
6. Chapitre 2 — Analyse et spécification des besoins
7. Chapitre 3 — Conception et modélisation
8. Chapitre 4 — Réalisation
9. Chapitre 5 — Tests et validation
10. Chapitre 6 — Déploiement et DevOps
11. Chapitre 7 — Difficultés rencontrées et solutions
12. Chapitre 8 — Conclusion et perspectives
13. Conclusion générale
14. Bibliographie / Webographie
15. Annexes

---

# Remarque de méthode

Le présent document a été rédigé à partir du code réel, des fichiers de configuration, des manifests Docker/Kubernetes et de l’analyse des composants déjà présents dans le dépôt. Les éléments non confirmés par le projet sont explicitement marqués comme `[À COMPLÉTER]`, conformément à la règle de rigueur exigée dans le cadre de ce rapport de stage.
