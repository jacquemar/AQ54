# Étape 1 : Build de l'application
FROM node:18-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY package*.json ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste du code source
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Exécuter l'application
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les fichiers de build depuis l'étape précédente
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Exposer le port 3000 pour l'application
EXPOSE 3000

# Lancer l'application en mode production
CMD ["node", "dist/main"]
