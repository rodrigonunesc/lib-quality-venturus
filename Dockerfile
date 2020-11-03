FROM node:alpine

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UIDs

RUN apk update

ENV LANGUAGE=pt_BR:pt:en
ENV LC_ALL=
ENV LANG=pt_BR.UTF-8
ENV ACCEPT_EULA=Y

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
