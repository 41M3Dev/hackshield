# Utiliser l'image Node.js officielle
FROM node:20-alpine

# Creer le repertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers de dependances
COPY package*.json ./

# Installer les dependances
RUN npm install --omit=dev

# Copier le code source
COPY . .

# Exposer le port de l'application
EXPOSE 9001

# Commande pour demarrer l'application
CMD ["node", "src/server.js"]
