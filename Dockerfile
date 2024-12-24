# Stage 1: Build Angular app
FROM node:18 AS build

WORKDIR /app

# Mise à jour de npm vers la version 10.8.3
RUN npm install -g npm@10.8.3

# Copy the package files and install dependencies
COPY package*.json ./

# Installer les dépendances avec --legacy-peer-deps pour ignorer les conflits de dépendances
RUN npm install --legacy-peer-deps

# Copy the entire project and build the Angular app
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the app using nginx
FROM nginx:alpine
COPY --from=build /app/dist/school-management-front/browser /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
