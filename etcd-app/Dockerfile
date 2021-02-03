FROM node:14.15-alpine
LABEL maintainer="Julio Cesar <julio@blackdevs.com.br>"

WORKDIR /app

RUN apk add curl

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8200

CMD ["node", "index.js"]

# docker image build --tag etcd-app:v1.0.0 -f ./etcd-app/Dockerfile ./etcd-app
# docker container run --name etcd-app -p 8200:8200 -v ${PWD}/etcd-app:/app etcd-app:v1.0.0

# run in interactive mode and replacing entrypoint to access sh
# docker container run --rm -p 8200:8200 -v ${PWD}/etcd-app:/app -it --entrypoint "" etcd-app:v1.0.0 /bin/sh

# docker container run --rm -it --entrypoint "" juliocesarmidia/etcd-app:$SHA sh
