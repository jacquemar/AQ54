# AQ54 - Air Quality DASHBOARD project

**AQ54** est un projet de surveillance de la qualité de l'air à Abidjan. Ce projet consiste à déployer des capteurs environnementaux pour mesurer les concentrations de particules fines dans l'air dans différentes zones urbaines, puis à visualiser ces données via une application web.

## Table des matières
- [Contexte](#contexte)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Technologies utilisées](#technologies-utilisées)
- [Installation et lancement](#installation-et-lancement)
  - [Prérequis](#prérequis)
  - [Étapes d'installation](#étapes-dinstallation)
  - [Docker Compose](#docker-compose)
- [Endpoints de l'API](#endpoints-de-lapi)

---

## Contexte

Le projet **AQ54** repose sur l'utilisation de capteurs **Airqino**, une technologie développée en collaboration avec le **Conseil National Italien de la Recherche (CNR)**, pour surveiller la pollution atmosphérique dans les zones urbaines d'Abidjan. Deux capteurs, **SMART188** et **SMART189**, sont déployés pour collecter des données sur la qualité de l'air sur un périmètre de 300 mètres.

L'application permet aux utilisateurs de visualiser ces données sous forme agrégée (par heure ou par jour) sur une interface conviviale avec des graphiques.

## Fonctionnalités principales

- **Visualisation des données** : Accès aux données de qualité de l'air (tempExt, hr, PM2.5, PM10, NO2, O3) à partir des capteurs déployés.
- **Agrégation des données** : Affichage des données agrégées par heure et par jour via des graphiques.
- **Sélection de la plage de temps** : Permet à l'utilisateur de consulter les données sur une période définie.
- **Tableaux de données** : Affichage détaillé des données des capteurs sous forme de tableau.
- **API privée** : Gestion des accès à l'API via un système d'authentification JWT.

## Technologies utilisées

### Frontend
- **React.js** avec **TypeScript** pour une interface utilisateur interactive et robuste.
- **TailwindCSS** pour le style.
- **Canvas.js** pour la visualisation graphique des données.

### Backend
- **NestJS** (Node.js Framework) pour créer une API RESTful robuste.
- **PostgreSQL** via **NeonDB** pour la gestion et l'agrégation des données.
- **Docker** et **Docker Compose** pour faciliter le déploiement en conteneurs.

### Outils tiers
- **Airqino API** : Récupération des données des capteurs via l'API externe (https://airqino-api.magentalab.it).

## Installation et lancement

### Prérequis

- **Node.js** version 14.x ou supérieure
- **Docker** & **Docker Compose**
- **NeonDB** ou un serveur PostgreSQL local
- **Accès à l'API Airqino** (https://airqino-api.magentalab.it)

### Étapes d'installation

1. Clonez le projet depuis GitHub :
   ```bash
   git clone https://github.com/jacquemar/AQ54.git
   ````

2. Accédez au répertoire du projet :
    ```bash
   cd AQ54
   ````

3. Installez les dépendances pour le front-end et le back-end
    ```bash
   npm install
   cd server && npm run start:dev
   ````
4. Configurez les variables d'environnement pour le backend (server/.env) & DOCKERFILE
    ```bash
   DATABASE_URL=postgres://username:password@hostname:port/dbname
   JWT_SECRET=votre_secret_jwt
   ````
5. Docker Compose
   Le projet est fourni avec un fichier Docker Compose. Pour lancer l'application avec Docker, exécutez la commande suivante à la racine du projet :
    ```bash
   docker-compose up --build
   ````
6. Ensuite, vous pouvez lancer les conteneurs directement avec :
    ```bash
   docker-compose up 
   ````
## Endpoints de l'API
L'API backend en NestJS fournit plusieurs endpoints pour la gestion des capteurs et des utilisateurs.

### Station ( SMART188 & SMART189 )
GET /stationName/current : Récupérer les dernières valeurs d'une station spécifique.
GET /stations/${stationName}/alldata?aggregation=${aggregationType}&startDate=${startDate}&endDate=${endDate} : Récupérer les données agrégées (par heure ou par jour) pour un capteur donné, sur une periode donnée.
GET /stations/monthly-averages : Récupérer les données moyennes mensuelles d'une station spécifique.

POST /auth/auth : Inscription d'un utilisateur.
POST /auth/login : Connexion d'un utilisateur.

## Structure du projet 

AQ54/ 
    ├── dist/ 
    ├── node_modules/ 
    ├── public/ 
    └──  server/ 
    │ 
    │    ├── dist/  
    │    ├── node_modules/ 
    │    └──  src/ 
    │    │   ├── airqino.module.ts  
    │    │   ├── airqino.service.ts  
    │    │   ├── app.controller.ts  
    │    │   ├── app.module.ts  
    │    │   ├── app.service.ts  
    │    │   ├── database.service.ts  
    │    │   ├── main.ts  
    │    │   ├── station.controller.ts 
    │    ├── test/ 
    │    ├── .env/ 
    │    ├── .gitignore 
    │    ├── nest-cli.json 
    │    ├── nodemon.json 
    │    ├── package-lock.json 
    │    ├── package.json 
    │    ├── README.md 
    │    ├── tsconfig.json 
    │    └── tsconfig.build.json 
    ├── src/  
    ├── common/  
    ├── components/  
    ├── css/  
    ├── fonts/  
    ├── hooks/  
    ├── images/  
    ├── layout/  
    ├── pages/  
    ├── types/  
    ├── App.tsx  
    ├── lib.d.tsx  
    ├── main.tsx  
    ├── config.tsx  
    ├── react-app-env.d.tsx  
    ├── Dockerfile.dev.tsx  
    ├── Dockerfile.tsx  
    ├── index.html.tsx  
    ├── package.json  
    ├── package-lock.json  
    ├── postcss.config.json  
    ├── README.md  
    ├── tailwind.json  
    ├── tsconfig.json  
    ├── tsconfig.node.json 
    └── vite.config.js 
    