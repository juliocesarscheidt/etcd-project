FROM node:10-alpine
LABEL maintainer="Julio Cesar <julio@blackdevs.com.br>"

WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY . /app/

EXPOSE 9000

CMD ["npm", "start"]

# docker image build --tag etcd-app:v1.0.0 -f ./etcd-app/Dockerfile ./etcd-app
# docker container run --name etcd-app -p 80:80 -v ${PWD}/etcd-app:/app etcd-app:v1.0.0

# run in interactive mode and replacing entrypoint to access bash
# docker container run --rm -p 80:80 -v ${PWD}/etcd-app:/app -it --entrypoint "" etcd-app:v1.0.0 /bin/bash
