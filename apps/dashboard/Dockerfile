FROM node:lts-alpine3.9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apk add curl

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
