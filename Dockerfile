FROM node:11
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . /usr/src/app

EXPOSE 4200

CMD [ "node", "./dist/index.js" ]