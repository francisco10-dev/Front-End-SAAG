# Usa la imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todos los archivos al directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto 3000 en el contenedor
EXPOSE 8080

# Define el comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["npm", "run", "dev"]

