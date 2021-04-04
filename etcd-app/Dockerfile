FROM node:14.15-alpine
LABEL maintainer="Julio Cesar <julio@blackdevs.com.br>"

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8200

CMD ["node", "index.js"]
