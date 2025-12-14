# Utiliser l'image Node.js officielle
FROM node:20-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port de l'application
EXPOSE 9001

# Commande pour démarrer l'application
CMD ["node", "src/server.js"]
