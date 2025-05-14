# Etapa de construcción
FROM node:lts-bullseye as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa de producción
FROM nginx:alpine
# Eliminar el contenido default de nginx
RUN rm -rf /usr/share/nginx/html/*
# Copiar los archivos construidos
COPY --from=build /app/dist/frontalm14/* /usr/share/nginx/html/
# Copiar la configuración de nginx
COPY ./config/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]