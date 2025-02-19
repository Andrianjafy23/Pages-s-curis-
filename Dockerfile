FROM node:16
# Utiliser une image officielle de Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port utilisé par ton application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]