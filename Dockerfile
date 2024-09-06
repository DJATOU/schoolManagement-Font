# Stage 1: Build Angular app
FROM node:18 AS build

WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project and build the Angular app
COPY . .
RUN npm run build --prod

# Stage 2: Serve the app using nginx
FROM nginx:alpine
COPY --from=build /app/dist/school-management-front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
